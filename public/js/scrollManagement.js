export const scrollMangagement = () => {
  let activeKey = null;
  let scrollAnimationFrame = null;
  let lastTimestamp = null;
  let currentScrollable = null;

  const scrollSpeed = 3000; // pixels per second

  function getScrollableParent(el) {
    while (el && el !== document.body) {
      const style = getComputedStyle(el);
      const overflowY = style.overflowY;

      const isScrollableY = (overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight;

      if (isScrollableY ) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  document.addEventListener("mouseover", (e) => {
    currentScrollable = getScrollableParent(e.target);
  });

  const scrollLoop = (timestamp) => {
    if (!activeKey || !currentScrollable) return;

    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    const moveBy = scrollSpeed * delta;

    switch (activeKey) {
      case "ArrowDown":
        currentScrollable.scrollTop += moveBy;
        break;
      case "ArrowUp":
        currentScrollable.scrollTop -= moveBy;
        break;
    }

    scrollAnimationFrame = requestAnimationFrame(scrollLoop);
  };

  document.addEventListener("keydown", (e) => {
    if (activeKey || !currentScrollable) return;

    if (["ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      activeKey = e.key;
      lastTimestamp = null;
      scrollAnimationFrame = requestAnimationFrame(scrollLoop);
    }
  }, { passive: false });

  document.addEventListener("keyup", (e) => {
    if (e.key === activeKey) {
      activeKey = null;
      cancelAnimationFrame(scrollAnimationFrame);
      lastTimestamp = null;
    }
  });
};
