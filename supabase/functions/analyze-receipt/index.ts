
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = "https://mcqnafdoqpjxadppxufh.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { receiptId } = await req.json();
    console.log(`Analyzing receipt: ${receiptId}`);
    
    if (!receiptId) {
      return new Response(
        JSON.stringify({ error: 'Receipt ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role key for admin operations
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get receipt details
    const { data: receipt, error: receiptError } = await supabase
      .from('receipt_uploads')
      .select('*')
      .eq('id', receiptId)
      .single();
      
    if (receiptError || !receipt) {
      console.error('Error fetching receipt:', receiptError);
      return new Response(
        JSON.stringify({ error: 'Receipt not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create receipt analysis record
    const { data: analysis, error: analysisError } = await supabase
      .from('receipt_analysis')
      .insert({
        receipt_id: receiptId,
        status: 'processing'
      })
      .select()
      .single();
    
    if (analysisError) {
      console.error('Error creating analysis record:', analysisError);
      return new Response(
        JSON.stringify({ error: 'Failed to create analysis record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get public URL of the receipt image
    const { data: publicUrlData } = supabase.storage
      .from('receipts')
      .getPublicUrl(receipt.file_path);
    
    const imageUrl = publicUrlData.publicUrl;
    console.log(`Receipt image URL: ${imageUrl}`);
    
    // Call Gemini API with the image URL
    try {
      const result = await analyzeReceiptWithGemini(imageUrl);
      console.log("Gemini API response received");
      
      // Update analysis record with the response
      await supabase
        .from('receipt_analysis')
        .update({
          status: 'completed',
          raw_response: result
        })
        .eq('id', analysis.id);
      
      // Parse the items from the response
      if (result && 
          result.candidates && 
          result.candidates[0] && 
          result.candidates[0].content && 
          result.candidates[0].content.parts && 
          result.candidates[0].content.parts[0] && 
          result.candidates[0].content.parts[0].text) {
        
        try {
          const responseText = result.candidates[0].content.parts[0].text;
          // Try to parse the JSON from the response
          const parsedData = JSON.parse(responseText);
          
          if (parsedData.receipt_items && Array.isArray(parsedData.receipt_items)) {
            const itemsToInsert = parsedData.receipt_items.map((item: any) => ({
              receipt_analysis_id: analysis.id,
              receipt_id: receiptId,
              item_name: item.item_name,
              quantity: item.quantity || null,
              unit_price: item.unit_price || null,
              total_price: item.total_price || null,
              item_category: item.item_category || null,
              notes: item.notes || null
            }));
            
            // Insert the items
            if (itemsToInsert.length > 0) {
              const { error: insertError } = await supabase
                .from('receipt_items')
                .insert(itemsToInsert);
              
              if (insertError) {
                console.error('Error inserting items:', insertError);
                // Update analysis status to reflect partial failure
                await supabase
                  .from('receipt_analysis')
                  .update({
                    status: 'partial',
                    error_message: `Items extraction succeeded but database insert failed: ${insertError.message}`
                  })
                  .eq('id', analysis.id);
              }
            }
            
            // Return the analysis results for the client to use
            return new Response(
              JSON.stringify({ 
                success: true, 
                analysisId: analysis.id, 
                itemCount: itemsToInsert.length,
                receiptTotal: parsedData.receipt_total,
                receiptDate: parsedData.receipt_date,
                vendorName: parsedData.vendor_name
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          } else {
            throw new Error("Invalid response format: missing receipt_items array");
          }
        } catch (parseError) {
          console.error('Error parsing Gemini response:', parseError);
          // Update analysis status to reflect failure
          await supabase
            .from('receipt_analysis')
            .update({
              status: 'failed',
              error_message: `Failed to parse response: ${parseError.message}`
            })
            .eq('id', analysis.id);
            
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Failed to parse Gemini response: ${parseError.message}` 
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } else {
        // Invalid response structure
        const errorMsg = "Invalid Gemini API response structure";
        console.error(errorMsg, result);
        
        // Update analysis status to reflect failure
        await supabase
          .from('receipt_analysis')
          .update({
            status: 'failed',
            error_message: errorMsg
          })
          .eq('id', analysis.id);
          
        return new Response(
          JSON.stringify({ success: false, error: errorMsg }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (apiError) {
      console.error('Error calling Gemini API:', apiError);
      
      // Update analysis status to reflect failure
      await supabase
        .from('receipt_analysis')
        .update({
          status: 'failed',
          error_message: `Gemini API error: ${apiError.message}`
        })
        .eq('id', analysis.id);
        
      return new Response(
        JSON.stringify({ success: false, error: `Gemini API error: ${apiError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: `Unexpected error: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function analyzeReceiptWithGemini(imageUrl: string) {
  const model = "gemini-2.5-pro-preview-03-25";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  
  // Create a prompt for receipt analysis with structured output requirements
  const prompt = `
    Analyze this receipt image. Extract each line item and format as a structured JSON array.
    For each item, extract:
    - item_name: The name of the product or service
    - quantity: The quantity purchased if available
    - unit_price: The price per unit if available
    - total_price: The total price for this line item
    - item_category: Categorize the item (e.g., materials, supplies, equipment, labor)
    
    Output format:
    {
      "receipt_items": [
        {
          "item_name": "Item description",
          "quantity": 2,
          "unit_price": 10.99,
          "total_price": 21.98,
          "item_category": "materials"
        },
        ...
      ],
      "receipt_total": 99.99,
      "receipt_date": "YYYY-MM-DD",
      "vendor_name": "Store Name"
    }
    
    Only respond with valid JSON, no additional text. If you're not sure about any value, use null.
  `;
  
  // Call Gemini with search grounding
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            { 
              inline_data: { 
                mime_type: "image/jpeg", 
                data: await fetchImageAsBase64(imageUrl)
              }
            }
          ]
        }
      ],
      generation_config: {
        temperature: 0.2,
        top_p: 0.95,
        top_k: 40
      },
      tools: [
        {
          google_search_tool: {}
        }
      ]
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }
  
  return await response.json();
}

async function fetchImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  
  // Convert blob to base64
  const buffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
}
