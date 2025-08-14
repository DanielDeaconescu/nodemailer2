const contactForm = document.querySelector("#nodemailerForm");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const data = {
    name: form.elements.name.value,
    email: form.elements.email.value,
    message: form.elements.message.value,
  };

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      window.location.href = "/thank-you.html";
    }
  } catch (error) {
    console.log("Submission failed: ", error);
  }
});
