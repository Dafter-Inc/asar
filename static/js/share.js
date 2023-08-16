// share qrcode
const qrcode = document.getElementById("QRCode");
const shareButtons = document.querySelectorAll(".share-button");

const trimURL = (url) => {
  const match = new RegExp(/(.*)\/success\/$/).exec(url);

  if (match) {
    return match[1];
  } else {
    return url;
  }
};

const message = "I pledge my support for a #CleanAirWithAsar! Do you? Pledge your support now - ";

shareButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const url = trimURL(window.location.href);
    const platform = button.classList[1];

    let shareUrl;
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          message + url
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(message)}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "reddit":
        shareUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          message + url
        )}`;
        break;
    }

    window.open(shareUrl, "_blank");
  });
});