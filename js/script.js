window.addEventListener("load", function () {
  const themeSwitcherToggleEl = document.querySelector(
    ".theme-switcher .theme-switcher-switch"
  );
  const themeSwitcherValueEls = document.querySelectorAll(
    ".theme-switcher-values span"
  );
  const calScreenEl = document.querySelector(".calculator-screen-text");
  const btnNumberEls = document.querySelectorAll(".btn-control.number");
  const btnDotEl = document.querySelector(".btn-control.dot");
  const btnDelEl = document.querySelector(".btn-control.del");
  const btnOperatorEls = document.querySelectorAll(".btn-control.operator");
  const btnEqualEl = document.querySelector(".btn-control.equal");
  const btnRestEl = document.querySelector(".btn-control.reset");
  const themeNamesArr = ["light", "dark"];
  let screen = "";
  let n1 = null;
  let n2 = null;
  let op = null;
  let isEquals = false;
  function switchToTheme(n = 1) {
    n = Number(n) || 1;
    themeNamesArr.forEach(function (name) {
      document.body.classList.remove(name);
    });
    if (n > themeNamesArr.length + 1 || n < 1) {
      n = 1;
    }
    if (n > 1) {
      document.body.classList.add(themeNamesArr[n - 2]);
    }
    localStorage.setItem("prefers-color-scheme", n);
  }
  function getCurrentThemeNumber() {
    let themeNumer = themeNamesArr.findIndex(function (name) {
      return document.body.classList.contains(name);
    });
    if (themeNumer != -1) {
      themeNumer += 2;
    } else {
      themeNumer = 1;
    }
    return themeNumer;
  }
  let initialThemeNumber = localStorage.getItem("prefers-color-scheme") || 1;
  switchToTheme(initialThemeNumber);

  function scollToCalScreenEnd() {
    calScreenEl.parentElement.scroll(calScreenEl.parentElement.scrollWidth, 0);
  }
  function formatNumberWithComma(num) {
    const arr = num.toString().split(".");
    const arr2 = arr[0].split("");
    if (!arr[0].match(/\d/)) return num;
    for (let i = arr2.length; i > 0; i -= 3) {
      if (arr2[i]) {
        arr2[i] = "," + arr2[i];
      }
    }
    arr[0] = arr2.join("");
    return arr.join(".");
  }

  function resetCal() {
    screen = "";
    n1 = null;
    n2 = null;
    op = null;
    calScreenEl.innerHTML = "";
  }
  resetCal();

  themeSwitcherToggleEl.addEventListener("click", (e) => {
    let currentTheme = getCurrentThemeNumber();
    currentTheme++;
    if (currentTheme > themeNamesArr.length + 1) {
      currentTheme = 1;
    }
    switchToTheme(currentTheme);
  });
  themeSwitcherValueEls.forEach((element, index) => {
    element.addEventListener("click", function (e) {
      switchToTheme(Number(index + 1));
    });
  });

  btnNumberEls.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (
        (!Number(screen) && !screen.includes(".")) ||
        !screen.match(/\d/) ||
        isEquals
      ) {
        screen = btn.innerHTML;
        isEquals = false;
      } else {
        screen += btn.innerHTML;
      }
      calScreenEl.innerHTML = formatNumberWithComma(screen);
      scollToCalScreenEnd();
    });
  });

  btnDotEl.addEventListener("click", (e) => {
    if (!screen.includes(".") && screen != "") {
      screen += ".";
      calScreenEl.innerHTML = formatNumberWithComma(screen);
      scollToCalScreenEnd();
      if (isEquals) {
        isEquals = false;
        n1 = null;
      }
    }
  });

  btnDelEl.addEventListener("click", (e) => {
    screen = screen.slice(0, screen.length - 1);
    calScreenEl.innerHTML = formatNumberWithComma(screen);
    scollToCalScreenEnd();
  });

  btnOperatorEls.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const obj = {
        "+": "+",
        "-": "-",
        x: "*",
        "/": "/",
      };
      if (n1 === null) {
        n1 = Number(screen);
        screen = "0";
      } else {
        n2 = Number(screen);
        n1 = eval(n1 + op + n2);
        screen = n1.toString();
        isEquals = true;
      }
      op = obj[btn.textContent];
      calScreenEl.innerHTML = formatNumberWithComma(screen);
      scollToCalScreenEnd();
    });
  });

  btnEqualEl.addEventListener("click", (e) => {
    if (n1 !== null) {
      n2 = Number(screen);
      n1 = eval(n1 + op + n2);
      screen = n1.toString();
      isEquals = true;
      calScreenEl.innerHTML = formatNumberWithComma(screen);
      scollToCalScreenEnd();
      n1 = null;
    }
  });

  btnRestEl.addEventListener("click", (e) => {
    resetCal();
  });
});
