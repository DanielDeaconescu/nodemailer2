// Toast Controller
const showToast = (message, isError = false) => {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = isError ? "toast-error" : "toast-success";
  toast.classList.add("toast-visible");

  setTimeout(() => {
    toast.classList.remove("toast-visible");
  }, 3000);
};

// Form Validation
const validateForm = (form) => {
  const errors = [];
  const fields = [
    { name: "name", label: "Full Name" },
    { name: "email", label: "Email" },
    { name: "message", label: "Message" },
  ];

  // If the input for a field is missing, throw an error
  fields.forEach((field) => {
    if (!form.elements[field.name].value.trim()) {
      errors.push(`${field.label} is required`);
    }
  });

  // Basic email validation
  const email = form.elements["email"].value;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Please enter a valid email");
  }

  return errors;
};

// Form submission

const contactForm = document.querySelector("#nodemailerForm");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  // Validate
  const errors = validateForm(form);
  if (errors.length > 0) {
    showToast(errors.join(", "), true);
    return;
  }

  // Prepare JSON data
  const jsonData = {
    name: form.elements.name.value,
    email: form.elements.email.value,
    message: form.elements.message.value,
  };

  try {
    const response = fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Submission failed");
    }

    showToast("Message sent successfully!");
    form.reset();
    setTimeout(() => {
      window.location.href = "/thank-you.html";
    }, 1500);
  } catch (error) {
    console.error("Submission error: ", error);
    showToast(error.message || "Failed to send message", true);
  }
});
