fetch("https://formsubmit.co/ajax/21054cs051@gmail.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({
    name: "TrustVerify System",
    message: "Triggering email activation to ensure it works."
  })
})
.then(res => res.json())
.then(data => console.log("Success:", data))
.catch(err => console.error("Error:", err));
