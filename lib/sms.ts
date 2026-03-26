export async function sendSMS(phone: string, message: string) {

  await fetch("https://sms.api.com/send", {
    method: "POST",
    body: JSON.stringify({
      to: phone,
      message
    })
  })

}