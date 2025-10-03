<?php
// Target username
$username = "gujju_everything";
$url = "https://www.instagram.com/api/v1/users/web_profile_info/?username=" . $username;

// Your Instagram session cookie (from your browser when logged in)
// To get this: log in to Instagram -> open DevTools -> Application -> Cookies -> copy "sessionid"
$sessionId = "75528838703%3AyoPT75lJm3oDAU%3A3%3AAYesm7ooLzbKSgWrSayqfeOhTjDdNrKZEyfDLF9G368";

// Setup curl
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Cookie: sessionid=$sessionId;",
    "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36"
]);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo "cURL error: " . curl_error($ch);
    exit;
}
curl_close($ch);

// Decode JSON
$data = json_decode($response, true);

if ($data) {
    echo "<pre>";
    print_r($data);
    echo "</pre>";
} else {
    echo "Failed to fetch data. Response: " . htmlspecialchars($response);
}
