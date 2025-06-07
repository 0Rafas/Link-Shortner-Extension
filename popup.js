document.addEventListener("DOMContentLoaded", () => {
    const originalUrlInput = document.getElementById("originalUrl");
    const shortenButton = document.getElementById("shortenButton");
    const shortenedUrlInput = document.getElementById("shortenedUrl");
    const copyButton = document.getElementById("copyButton");
    const errorMessageDiv = document.getElementById("errorMessage");
    const creditsButton = document.getElementById("creditsButton");
    const creditsModal = document.getElementById("creditsModal");
    const closeModalButton = document.getElementById("closeModalButton");

    async function shortenUrl(url) {
        errorMessageDiv.textContent = "";
        shortenButton.disabled = true;
        shortenButton.textContent = "Shortening...";
        shortenedUrlInput.value = "";

        if (!url || !url.startsWith("http://") && !url.startsWith("https://")) {
            errorMessageDiv.textContent = "Please enter a valid URL (starting with http:// or https://).";
            shortenButton.disabled = false;
            shortenButton.textContent = "Shorten";
            return;
        }

        try {
            const encodedUrl = encodeURIComponent(url);
            const response = await fetch(`https://is.gd/create.php?format=json&url=${encodedUrl}`);
            
            if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.shorturl) {
                shortenedUrlInput.value = data.shorturl;
            } else if (data.errormessage) {
                errorMessageDiv.textContent = `Error: ${data.errormessage}`;
            } else {
                 errorMessageDiv.textContent = "Unknown error from shortening service.";
            }
        } catch (error) {
            console.error("Shortening error:", error);
            errorMessageDiv.textContent = "Failed to shorten URL. Check connection or URL.";
        } finally {
            shortenButton.disabled = false;
            shortenButton.textContent = "Shorten";
        }
    }

    shortenButton.addEventListener("click", () => {
        shortenUrl(originalUrlInput.value.trim());
    });

    originalUrlInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); 
            shortenUrl(originalUrlInput.value.trim());
        }
    });

    copyButton.addEventListener("click", () => {
        const urlToCopy = shortenedUrlInput.value;
        if (urlToCopy) {
            navigator.clipboard.writeText(urlToCopy).then(() => {
                copyButton.title = "Copied!";
                setTimeout(() => { copyButton.title = "Copy shortened URL"; }, 1500);
            }).catch(err => {
                console.error("Failed to copy:", err);
                errorMessageDiv.textContent = "Failed to copy URL.";
            });
        }
    });

    creditsButton.addEventListener("click", () => {
        creditsModal.style.display = "block";
    });

    closeModalButton.addEventListener("click", () => {
        creditsModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target == creditsModal) {
            creditsModal.style.display = "none";
        }
    });
});

