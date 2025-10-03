<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserCredit;
use App\Models\UserProject;
use App\Models\UserTemplate;
use App\Services\GeminiService;
use App\Services\OllamaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
  use Razorpay\Api\Api;

class UserCreditController extends Controller
{
    //

    public function transactions(Request $request){
        return response()->json(
            [
                'data'=>UserCredit::where('user_id',$request->user()->id)->orderBy('id','desc')->get()
            ]
            );
    }
        public function balance(Request $request){
        return response()->json(
            [
                'balance'=>UserCredit::where('user_id',$request->user()->id)->sum('amt')
            ]
            );
    }
    
     public function createOrder(Request $request)
    {
        $api = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));

        $order = $api->order->create([
            'receipt' => 'rcptid_' . time(),
            'amount' => $request->amount * 100, // Amount in paisa
            'currency' => 'INR',
        ]);

        return response()->json([
            'order_id' => $order->id,
            'razorpay_key' => env('RAZORPAY_KEY'),
            'amount' => $request->amount * 100,
            'currency' => 'INR',
        ]);
    }
    public function verifyPayment(Request $request){
         $signature = $request->razorpay_signature;
    $paymentId = $request->razorpay_payment_id;
    $orderId = $request->razorpay_order_id;
$tokens = $request->tokens;
    $api = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));
    try {
         $attributes = [
            'razorpay_order_id' => $orderId,
            'razorpay_payment_id' => $paymentId,
            'razorpay_signature' => $signature,
        ];
        $api->utility->verifyPaymentSignature($attributes);

        // Now capture the payment (for manual capture flow)
        $payment = $api->payment->fetch($paymentId);

        if ($payment->status === 'authorized') {
            $captured = $payment->capture([
                'amount' => $payment->amount, // in paisa
                'currency' => 'INR'
            ]);
            UserCredit::create([
                  'remarks'=>'Topup',
        'amt'=>$tokens,
        'user_id'=>$request->user()->id,
            ]);
            return response()->json([
                'message'=>'Payment successfull!'
            ]);
        }else{
        return response()->json(['status' => 'error', 'message' =>'Payment not verified'], 400);

        }

 } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
    }
    }
    
    
}
