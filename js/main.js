let allLinks = $("nav .left .dynamic li");
let searchField = $(allLinks).eq(0);
let categoryField = $(allLinks).eq(1);
let areaField = $(allLinks).eq(2);
let ingredientField = $(allLinks).eq(3);
let contactField = $(allLinks).eq(4);
// contact section
let inputName = $(".contact-section .input-Name input");
let inputEmail = $(".contact-section .input-Email input");
let inputPhone = $(".contact-section .input-Phone input");
let inputAge = $(".contact-section .input-Age input");
let inputPass = $(".contact-section .input-Pass input");
let inputRepass = $(".contact-section .input-Repass input");
let buttonSubmit = $(".contact-container button");

$(searchField).click(function () {
  hideAllSection(".search-section");
  showSection(".search-section");
  slideOut();
  $(".search-section").find(".SN").val("");
  $(".search-section .get-here").html("");
  $(".search-section").find("input").css("z-index", "9999999999");
  $(".search-section")
    .find(".SN")
    .keyup(function () {
      displaySearchResultByName($(this).val(), ".search-section .get-here");
    });
  $(".search-section")
    .find(".SF")
    .keyup(function () {
      displaySearchResultByFirstLetter(
        $(this).val(),
        ".search-section .get-here"
      );
    });
});
$(categoryField).click(function () {
  showReload();
  hideAllSection(".category-section");
  showSection(".category-section");
  slideOut();
  getCategoryList();
});
$(areaField).click(function () {
  showReload();

  hideAllSection(".area-section");
  showSection(".area-section");
  slideOut();
  getArea();
});
ingredientField.click(function () {
  showReload();
  hideAllSection(".ingredients-section");
  showSection(".ingredients-section");
  slideOut();
  getIngredients();
});

$(contactField).click(function () {
  clearAllInputs();
  $(".contact-container p").css("display", "none");
  hideAllSection(".contact-container");
  showSection(".contact-container");
  getInputs();
  slideOut();
});

async function getMeals(value, target) {
  // get all meals by strMeals
  let res =
    await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}
  `);

  let data = (await res.json()).meals;
  console.log(data);
  hideAllSection(target);
  showSection(target);
  hideReload();
  $(":root").css("overflow", "auto");
  displayMeals(data, target);
}

function displayMeals(data, targetSection) {
  // display all meals that got from getMeals function
  let content = ``;
  console.log(data);
  if (data == null) {
    $(targetSection).html(content);
    return;
  }
  for (let index = 0; index < data.length; index++) {
    content += `<div class="col-md-3">
    <div
      class="content rounded rounded-3 overflow-hidden position-relative"
    >
      <img src="${data[index].strMealThumb}" class="w-100 d-block" />
      <div class="layer">
        <h1>${data[index].strMeal}</h1>
      </div>
    </div>
  </div>`;
  }
  $(targetSection).html(content);
  $(`${targetSection} .col-md-3 .content`).click(function () {
    let targetMale = $(this).find(".layer").children().text();
    console.log(targetMale);
    data.filter((meals) => {
      if (meals.strMeal == targetMale) {
        console.log(meals);
        showReload();
        displayTarget(meals);
      }
    });
  });
}

function displayTarget(meals) {
  let strIngredient = this.getIngredientAndMeasure(meals);
  console.log(strIngredient);
  let mealsTags = this.getTags(meals);
  let content = `
  <div class="col-md-4">
  <div class="content">
    <img src="${meals.strMealThumb}" class="w-100 d-block rounded rounded-3" />
    <h2 class="my-2">${meals.strMeal}</h2>
  </div>
</div>
<div class="col-md-8">
  <div class="content">
    <h2>Instructions</h2>
    <p>
      ${meals.strInstructions}
    </p>
    <ul class="list-unstyled d-flex flex-column gap-2">
      <li>Area : ${meals.strArea}</li>
      <li>Category : ${meals.strCategory}</li>
      <li>
        Recipes :
        <div class="Recipes d-flex flex-wrap gap-2">
        ${strIngredient
          .map((item) => {
            return `<div class = "items"> ${item} </div>`;
          })
          .join(" ")}
        </div>
      </li>
      <li>
        Tags :
        <div class="tags d-flex flex-wrap gap-2">
        ${mealsTags
          .map((t) => {
            return `<div class="tag">${t}</div>`;
          })
          .join("")}
        </div>

      </li>
    </ul>
    <div class="more-details">
      <button class="btn btn-success"> <a href="${
        meals.strSource
      }" target="_blank">  Source <a/></button>
      <button class="btn btn-danger"> <a href="${
        meals.strYoutube
      }" target="_blank">  Youtube <a/> </button>
    </div>
  </div>
</div>
  `;
  hideAllSection(".target-section");
  showSection(".target-section");
  $(".target-section").html(content);
  setTimeout(() => {
    hideReload();
    setTimeout(() => {
      showReload();
      setTimeout(() => {
        hideReload();
      }, 200);
    }, 200);
  }, 200);
}
async function getCategoryList() {
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php
  `);
  let data = (await res.json()).categories;
  console.log(data);
  displayCategoryList(data);
  hideReload();
}
async function displaySearchResultByName(value, target) {
  showReload();
  let res =
    await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}
  `);
  let data = (await res.json()).meals;
  console.log(data);
  displayMeals(data, target);
  hideReload();
}
async function displaySearchResultByFirstLetter(value, target) {
  showReload();
  let res =
    await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${value}
  `);
  let data = (await res.json()).meals;
  console.log(data);
  if (data != null) displayMeals(data, target);
  hideReload();
}
function displayCategoryList(data) {
  let content = ``;
  for (let index = 0; index < data.length; index++) {
    content += `<div class="col-md-3">
    <div
      class="content rounded rounded-3 overflow-hidden position-relative"
    >
      <img src="${data[index].strCategoryThumb}" class="w-100 d-block" />
      <div class="layer d-fle flex-column">
        <h1>${data[index].strCategory}</h1>
        <p class="text-center truncate">${data[index].strCategoryDescription}</p>
      </div>
    </div>
  </div>`;
  }
  $(".category-section").html(content);
  $(".category-section .col-md-3 .content").click(function () {
    let targetMale = $(this).find(".layer").find("h1").text();
    console.log(targetMale);
    data.filter((meals) => {
      if (meals.strCategory == targetMale) {
        console.log(meals.strCategory);
        showReload();
        searchByCategory(meals.strCategory);
      }
    });
  });
}
async function searchByCategory(value) {
  let res =
    await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${value}
  `);
  let data = (await res.json()).meals;
  console.log(data);
  displayMeals2(data, ".category-section");
  hideReload();
}
async function getArea() {
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = (await res.json()).meals;
  console.log(data);
  displayAreaList(data);
  hideReload();
}
function displayAreaList(data) {
  let content = ``;
  for (let index = 0; index < data.length; index++) {
    content += `<div class="col-md-3">
    <div
      class="content rounded rounded-3 overflow-hidden position-relative"
    >
      <img src="img/—Pngtree—vector house icon_4013710.png" class="w-50 d-block" />
      <h1 class"text-center">${data[index].strArea}</h1>
    </div>
  </div>`;
  }
  $(".area-section").html(content);
  $(".area-section .col-md-3 .content").click(function () {
    let targetMale = $(this).find("h1").text();
    data.filter((meals) => {
      if (meals.strArea == targetMale) {
        console.log(meals.strArea);
        showReload();
        getAreaMeal(meals.strArea);
      }
    });
  });
}
async function getAreaMeal(value) {
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${value}`
  );
  let data = (await res.json()).meals;
  console.log(data);
  displayMeals2(data, ".area-section");
  hideReload();
}
async function getIngredients() {
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = (await res.json()).meals;
  console.log(data);
  displayIngredients(data);
  hideReload();
}
function displayIngredients(data) {
  let newData = [];
  let content = ``;
  for (let index = 0; index < 20; index++) {
    content += `<div class="col-md-3">
    <div
      class="content rounded rounded-3 overflow-hidden position-relative d-flex flex-column align-items-center justify-content-center"
    >
      <img src="img/download.jpeg" class="w-25 d-block" />
      <h1 class="fs-3">${data[index].strIngredient}</h1>
      <p class="truncate text-center">${data[index].strDescription}</p>
    </div>
  </div>`;
    newData.push(data[index]);
  }
  $(".ingredients-section").html(content);
  $(".ingredients-section .col-md-3 .content").click(function () {
    let targetMale = $(this).find("h1").text();
    console.log(targetMale);
    newData.forEach((meals) => {
      if (meals.strIngredient == targetMale) {
        showReload();
        getIngredientsMeal(meals.strIngredient);
      }
    });
  });
}
async function getIngredientsMeal(value) {
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${value}`
  );
  let data = (await res.json()).meals;
  console.log(data);
  displayMeals2(data, ".ingredients-section");
  hideReload();
}
function displayMeals2(data, targetSection) {
  let content = ``;
  console.log(data.length);
  for (let index = 0; index < data.length; index++) {
    content += `<div class="col-md-3">
    <div
      class="content rounded rounded-3 overflow-hidden position-relative"
    >
      <img src="${data[index].strMealThumb}" class="w-100 d-block" />
      <div class="layer">
        <h1 class="text-black fs-3" >${data[index].strMeal}</h1>
      </div>
    </div>
  </div>`;
  }
  $(targetSection).html(content);
  $(`${targetSection} .col-md-3 .content`).click(function () {
    let targetMale = $(this).find(".layer").children().text();
    console.log(targetMale);
    data.filter((meals) => {
      if (meals.strMeal == targetMale) {
        console.log(meals);
        showReload();
        getMeals2(meals.strMeal);
      }
    });
  });
}
async function getMeals2(value) {
  let res =
    await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}
  `);
  let data = (await res.json()).meals;
  console.log(data);
  displayTarget(data[0]);
  hideReload();
}
$(document).ready(function () {
  getMeals(" ", ".main-section");
});

// ! animation on site
let navWidth = $("nav").outerWidth();
let rightSideWidth = $("nav .right").outerWidth();
$(".side-nav").animate({ left: -(navWidth - rightSideWidth) }, 300);

$("nav .btn-slidOut").click(slideOut);
$("nav .btn-slidIn").click(slideIn);
function slideOut() {
  $("nav .btn-slidIn").removeClass("d-none");
  $("nav .btn-slidIn").addClass("d-block");
  $(".side-nav ul").addClass("animate__fadeOutBottomLeft");
  $(".side-nav").animate({ left: -(navWidth - rightSideWidth) }, 800);
  $(".side-nav .dynamic li").eq(0).css("transform", "translateY(0)");
  $(".side-nav .dynamic li").eq(1).css("transform", "translateY(0)");
  $(".side-nav .dynamic li").eq(2).css("transform", "translateY(0)");
  $(".side-nav .dynamic li").eq(3).css("transform", "translateY(0)");
  $(".side-nav .dynamic li").eq(4).css("transform", "translateY(0)");
  $("nav .btn-slidOut").toggleClass("d-none");
}
$(".side-nav .dynamic li").eq(0).css("transition", "transform  400ms 500ms");
$(".side-nav .dynamic li").eq(1).css("transition", "transform  400ms 600ms ");
$(".side-nav .dynamic li").eq(2).css("transition", "transform  400ms 700ms ");
$(".side-nav .dynamic li").eq(3).css("transition", "transform  400ms 800ms ");
$(".side-nav .dynamic li").eq(4).css("transition", "transform  400ms 1000ms ");
function slideIn() {
  $("nav .btn-slidOut").removeClass("d-none");
  $("nav .btn-slidOut").addClass("d-block");
  $(".side-nav ul").removeClass("animate__fadeOutBottomLeft");
  $(".side-nav ul").addClass("animate__fadeInBottomLeft");
  console.log($(".side-nav .dynamic li"));
  console.log($(".side-nav .left .dynamic li"));
  $("nav .btn-slidIn").toggleClass("d-none");
  $(".side-nav").animate({ left: 0 }, 800);
  $(".side-nav .dynamic li").eq(0).css("transform", "translateY(-20px)");
  $(".side-nav .dynamic li").eq(1).css("transform", "translateY(-20px)");
  $(".side-nav .dynamic li").eq(2).css("transform", "translateY(-20px)");
  $(".side-nav .dynamic li").eq(3).css("transform", "translateY(-20px)");
  $(".side-nav .dynamic li").eq(4).css("transform", "translateY(-20px)");
}

function hideAllSection(target) {
  let Arr = [
    ".main-section",
    ".target-section",
    ".search-section",
    ".category-section",
    ".area-section",
    ".ingredients-section",
    ".contact-container",
  ];
  for (let index = 0; index < Arr.length; index++) {
    if (target != Array[index]) {
      $(Arr[index]).addClass("d-none");
    }
  }
}
function showSection(target) {
  $(target).removeClass("d-none");
  $(target).addClass("d-flex");
}
function showReload() {
  $(".loading-screen ").removeClass("d-none");
  $(".loading-screen ").addClass("d-flex");
}
function hideReload() {
  $(".loading-screen ").addClass("d-none");
  $(".side-nav").css("z-index", "99999999999999");
}
function getIngredientAndMeasure(meals) {
  let strIngredient = [];
  for (const key in meals) {
    if (key.includes("strMeasure") && meals[key] != " " && meals[key] != "") {
      strIngredient.push(meals[key]);
    }
  }
  let cnt = 0;
  for (const key in meals) {
    if (
      key.includes("strIngredient") &&
      meals[key] != "" &&
      meals[key] != " "
    ) {
      strIngredient[cnt] += " " + meals[key];
      cnt++;
    }
  }
  return strIngredient;
}
function getTags(meals) {
  return meals.strTags != null ? meals.strTags.split(",") : [];
}

// contact section logic

function CheckAllInputs() {
  if (
    checkValidName($(inputName).val()) &&
    checkValidEmail($(inputEmail).val()) &&
    checkValidPhone($(inputPhone).val()) &&
    checkValidPass($(inputPass).val()) &&
    checkValidRePass($(inputRepass).val()) &&
    checkValidAge($(inputAge).val())
  ) {
    buttonSubmit.removeClass("disabled");
  } else {
    buttonSubmit.addClass("disabled");
  }
}

function checkValidName(value) {
  let regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
  return regex.test(value) && value != " ";
}
function checkValidEmail(value) {
  let regex =
    /^(http(s):\/\/.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
  return regex.test(value) && value != " ";
}
function checkValidPhone(value) {
  let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return regex.test(value) && value != " ";
}
function checkValidAge(value) {
  let regex = /^\S[0-9]{0,3}$/;
  return regex.test(value) && value != " ";
}
function checkValidPass(value) {
  let regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(value) && value != " ";
}
function checkValidRePass(value) {
  let regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(value) && value != " " && value == $(inputPass).val();
}
function getInputs() {
  $(inputName).keyup(function () {
    if (!checkValidName($(this).val())) {
      $(this).next().css("display", "block");
    } else {
      $(this).next().css("display", "none");
    }
    CheckAllInputs();
  });
  $(inputEmail).keyup(function () {
    if (!checkValidEmail($(this).val())) {
      $(this).next().css("display", "block");
    } else {
      $(this).next().css("display", "none");
    }
    CheckAllInputs();
  });
  $(inputPhone).keyup(function () {
    console.log(checkValidPhone($(this).val()));
    if (!checkValidPhone($(this).val())) {
      $(this).next().css("display", "block");
    } else {
      $(this).next().css("display", "none");
    }
    CheckAllInputs();
  });
  $(inputAge).keyup(function () {
    if (!checkValidAge($(this).val())) {
      $(this).next().css("display", "block");
    } else {
      $(this).next().css("display", "none");
    }
    CheckAllInputs();
  });
  $(inputPass).keyup(function () {
    if (!checkValidPass($(this).val())) {
      $(this).next().css("display", "block");
    } else {
      $(this).next().css("display", "none");
    }
    CheckAllInputs();
  });
  $(inputRepass).keyup(function () {
    if (!checkValidRePass($(this).val())) {
      $(this).next().css("display", "block");
    } else {
      $(this).next().css("display", "none");
    }
    CheckAllInputs();
  });
}
function clearAllInputs() {
  $(inputName).val("");
  $(inputEmail).val("");
  $(inputPhone).val("");
  $(inputAge).val("");
  $(inputPass).val("");
  $(inputRepass).val("");
}
