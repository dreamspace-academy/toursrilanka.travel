const http = require("http")

// Define the URL to check
const url = "http://localhost:5000/api/health"

console.log(`🔍 Checking if backend server is running at ${url}...`)

// Make a GET request
http
  .get(url, (res) => {
    const { statusCode } = res
    let data = ""

    // A chunk of data has been received.
    res.on("data", (chunk) => {
      data += chunk
    })

    // The whole response has been received.
    res.on("end", () => {
      console.log(`✅ Backend server is running! Status code: ${statusCode}`)
      console.log("Response data:")
      try {
        const parsedData = JSON.parse(data)
        console.log(JSON.stringify(parsedData, null, 2))
      } catch (e) {
        console.log("Raw response (not JSON):", data)
      }
    })
  })
  .on("error", (err) => {
    console.error(`❌ Error: Backend server is not running or not accessible.`)
    console.error(`   Details: ${err.message}`)
    console.error("\n🔧 Troubleshooting steps:")
    console.error("1. Make sure your backend server is running")
    console.error("2. Check if the server is running on port 5000")
    console.error("3. Verify that the /api/health endpoint is available")
    console.error("4. Check for any firewall or network issues")
  })
