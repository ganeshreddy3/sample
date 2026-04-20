fetch("https://formsubmit.co/21054cs051@gmail.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "http://localhost:5173",
    "Referer": "http://localhost:5173/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
  },
  body: new URLSearchParams({
    _subject: "CRON TEST",
    message: "This is a backend test."
  }).toString()
})
.then(res => {
   console.log("Status:", res.status);
   return res.text();
})
.then(data => console.log("Success? ", data.includes("Check your email") || data.includes("reCAPTCHA")))
.catch(err => console.error("Error:", err));
