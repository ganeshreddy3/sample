fetch("https://formsubmit.co/ajax/21054cs051@gmail.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Origin": "http://localhost:5173",
    "Referer": "http://localhost:5173/"
  },
  body: JSON.stringify({
    _subject: "CRITICAL: Food Product Licenses Expiring!",
    message: "This is the 11:00 AM Cron Job sending the report. Manufacturer: DEMO, FSSAI: 123456, Expiring: 14 days"
  })
})
.then(res => res.json())
.then(data => console.log("Success:", data))
.catch(err => console.error("Error:", err));
