function equalizeCardWidths() {
  const cards = document.querySelectorAll('.card');
  let maxWidth = 0;

  // Reset widths to natural size first to get accurate measurements
  cards.forEach(card => {
    card.style.width = 'auto';
  });

  // Find the widest card
  cards.forEach(card => {
    const cardWidth = card.offsetWidth;
    if (cardWidth > maxWidth) {
      maxWidth = cardWidth;
    }
  });

  // Set all cards to the widest width
  cards.forEach(card => {
    card.style.width = `${maxWidth - 54}px`;
  });
}

// Run after the window loads to make sure images are loaded and widths are accurate
window.addEventListener('resize', equalizeCardWidths); // Optional: reapply on window resize
