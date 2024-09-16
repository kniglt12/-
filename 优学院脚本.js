// ==UserScript==
// @name         华科优学院习概
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动填入选择题答案，需要点进题目页面
// @author       shadowknight
// @match        https://ua.ulearning.cn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
// 全局变量，跟踪页面索引
let lastPageIndex = null;

// 设置答案数组
const answers = [
    "DDCDC", "DCDADABACD", "ABDCC", "ABDBB", "DBBAC", "CAADB",
    "AABDD", "BAABD", "BACBA", "CBBDA", "DCBDA", "BDBAC",
    "ADDAC", "CBCCC", "DABBC", "BDBBA", "BCABB"
];

// 页面元素和对应的页面索引
const pageElements = [
    "pageElement6348734", "pageElement6348741", "pageElement6348748",
    "pageElement6348752", "pageElement6348756", "pageElement6348763",
    "pageElement6348766", "pageElement6348769", "pageElement6348772",
    "pageElement6348775", "pageElement6348778", "pageElement6348781",
    "pageElement6348784", "pageElement6348787", "pageElement6348790",
    "pageElement6348793", "pageElement6348796"
];

// 获取当前页面的 pageIndex
function getPageIndex() {
    for (let i = 0; i < pageElements.length; i++) {
        if (document.getElementById(pageElements[i])) {
            return i;  // 返回当前页面的索引
        }
    }
    return null;  // 如果没有匹配的页面元素，返回 null
}

// 监听页面变化
function listenForPageChange() {
    const observer = new MutationObserver(function (mutations) {
        const currentPageIndex = getPageIndex();

        // 如果 pageIndex 没有变化，就不执行
        if (currentPageIndex !== null && currentPageIndex !== lastPageIndex) {
            lastPageIndex = currentPageIndex;
            console.log("当前页面索引:", currentPageIndex);

            // 获取当前页面的答案
            let currentAnswers = answers[currentPageIndex].split('');

            // 处理当前页面的题目
            fillAnswers(currentAnswers);
        } else {
            console.log("页面没有变化，跳过操作。");
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// 根据答案填入选项
function fillAnswers(answers) {
    let questionWrappers = document.querySelectorAll('.question-wrapper');
    questionWrappers.forEach(function (questionWrapper, questionIndex) {
        if (!questionWrapper.getAttribute('data-selected')) { // 如果没有处理过
            let correctAnswer = answers[questionIndex];
            console.log("当前题目的正确答案是:", correctAnswer);

            // 获取每个题目的选项并选择正确答案
            let choices = questionWrapper.querySelectorAll('.choice-item');
            choices.forEach(function (choice) {
                let optionText = choice.querySelector('.option').innerText.trim();
                if (optionText.startsWith(correctAnswer)) {
                    console.log("选择选项:", optionText);
                    choice.click(); // 点击正确答案
                    questionWrapper.setAttribute('data-selected', 'true'); // 标记已经处理过
                }
            });
        } else {
            console.log("题目已处理，跳过。");
        }
    });
}

// 启动监听
listenForPageChange();
})();