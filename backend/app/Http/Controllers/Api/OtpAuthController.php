<?php 
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Otp;
use App\Models\UserCredit;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class OtpAuthController extends Controller
{
    public function loginWallet(Request $request){
        $request->validate([
            'address'=>'required',
            'slice'=>'required'
        ]);
        $User = User::where('mobile',$request->address)->first();
        if(!$User){
            $User = User::create([
                'name'=>$request->slice,
                'mobile'=>$request->address
            ]);
               UserCredit::create([
            'remarks'=>'Bonus',
            'amt'=>100,
            'user_id'=>$User->id
        ]);
        }
                $token = $User->createToken('auth_token')->plainTextToken;
     
         return response()->json([
            'message' => 'Login verified successfully',
            'token' => $token,
            'user' => $User
        ]);
    }
    public function sendOtp(Request $request)
    {
        $request->validate([
            'mobile' => 'required|digits:10'
        ]);

        $otpCode = rand(100000, 999999);

        Otp::where('mobile', $request->mobile)->delete(); // delete old OTPs

        Otp::create([
            'mobile' => $request->mobile,
            'otp' => $otpCode,
            'expires_at' => Carbon::now()->addMinutes(5)
        ]);

        // TODO: Send SMS here (log for now)
        // Log::info("OTP for {$request->mobile} is {$otpCode}");

        return response()->json(['message' => 'OTP sent successfully','otp'=>$otpCode,'askName'=>User::where('mobile',$request->mobile)->count()>0?false:true]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'mobile' => 'required|digits:10',
            'otp' => 'required|digits:6',
            'name' => 'string',

        ]);

        $otpData = Otp::where('mobile', $request->mobile)
                      ->where('otp', $request->otp)
                      ->where('expires_at', '>', Carbon::now())
                      ->first();

        if (!$otpData) {
            return response()->json(['message' => 'Invalid or expired OTP'], 422);
        }
if(! User::where('mobile',$request->mobile)->first() and !filled($request->name)){
               return response()->json(['message' => 'Mobile number is required'], 422);
 
}
if(!User::where('mobile',$request->mobile)->first()){
  $bonus=1;
}

$user = User::firstOrCreate(
    ['mobile' => $request->mobile], // search condition
    ['name' => $request->name]      // attributes for new record
);
if(isset($bonus)){
     UserCredit::create([
            'remarks'=>'Bonus',
            'amt'=>100,
            'user_id'=>$user->id
        ]);
}
        $token = $user->createToken('auth_token')->plainTextToken;

        Otp::where('mobile', $request->mobile)->delete(); // clear used OTPs

        return response()->json([
            'message' => 'OTP verified successfully',
            'token' => $token,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
