/* ==================================================
   INITIAL PAGE STATE
================================================== */

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
    window.scrollTo(0, 0);
});

window.addEventListener("pageshow", () => {
    window.scrollTo(0, 0);
});


const navButtons = document.querySelectorAll(".nav-button");
const contentPanels = document.querySelectorAll(".content-panel");

navButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const selectedProject = button.dataset.project;
        const selectedView = button.dataset.view;

        navButtons.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        contentPanels.forEach((panel) => {
            panel.classList.remove("active");
        });

        const targetPanel = document.querySelector(
            `.content-panel[data-project="${selectedProject}"][data-view="${selectedView}"]`
        );

        if (targetPanel) {
            targetPanel.classList.add("active");
        }

    });

});


/* ==================================================
   RFP DEMO
================================================== */

const rfpAnalyzeButton = document.getElementById("rfp-analyze-button");
const rfpSpecButton = document.getElementById("rfp-spec-button");
const rfpDraftButton = document.getElementById("rfp-draft-button");

const rfpStep1 = document.getElementById("rfp-step-1");
const rfpStep2 = document.getElementById("rfp-analysis-section");
const rfpStep3 = document.getElementById("rfp-spec-section");
const rfpStep4 = document.getElementById("rfp-draft-section");

const rfpSteps = [
    rfpStep1,
    rfpStep2,
    rfpStep3,
    rfpStep4
];

const rfpPrevButtons = document.querySelectorAll(
    ".demo-prev-button[data-rfp-step]"
);

const rfpDemoPanel = document.querySelector(
    '.content-panel[data-project="rfp"][data-view="demo"]'
);

const rfpStatusSummary = document.getElementById(
    "rfp-status-summary"
);

const rfpWarningModal = document.getElementById(
    "rfp-warning-modal"
);

const rfpWarningMessage = document.getElementById(
    "rfp-warning-message"
);

const rfpReviewButton = document.getElementById(
    "rfp-review-button"
);

const rfpConfirmSpecButton = document.getElementById(
    "rfp-confirm-spec-button"
);


function getRfpUnresolvedCounts() {

    const checkCount = document.querySelectorAll(
        "#rfp-analysis-section .status-check"
    ).length;

    const detailCount = document.querySelectorAll(
        "#rfp-analysis-section .status-detail"
    ).length;

    return {
        checkCount,
        detailCount
    };

}


function updateRfpStatusSummary() {

    if (!rfpStatusSummary) {
        return;
    }

    const {
        checkCount,
        detailCount
    } = getRfpUnresolvedCounts();


    if (checkCount === 0 && detailCount === 0) {

        rfpStatusSummary.hidden = true;
        rfpStatusSummary.textContent = "";

        return;
    }


    const statusParts = [];

    if (checkCount > 0) {
        statusParts.push(`확인 필요 ${checkCount}건`);
    }

    if (detailCount > 0) {
        statusParts.push(`구체화 필요 ${detailCount}건`);
    }


    rfpStatusSummary.textContent =
        statusParts.join(" · ");

    rfpStatusSummary.hidden = false;
}


function showRfpStep(stepNumber) {

    rfpSteps.forEach((step) => {

        if (!step) {
            return;
        }

        step.classList.add("demo-hidden");

    });


    const targetStep = rfpSteps[stepNumber - 1];

    if (!targetStep) {
        return;
    }

    targetStep.classList.remove("demo-hidden");


    if (stepNumber === 2) {
        updateRfpStatusSummary();
    }


    if (rfpDemoPanel) {

        const heading = rfpDemoPanel.querySelector(
            ".project-heading"
        );

        if (heading) {

            heading.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }

}


if (rfpAnalyzeButton) {

    rfpAnalyzeButton.addEventListener("click", () => {
        showRfpStep(2);
    });

}


if (rfpSpecButton) {

    rfpSpecButton.addEventListener("click", () => {

        const {
            checkCount,
            detailCount
        } = getRfpUnresolvedCounts();


        if (checkCount === 0 && detailCount === 0) {

            showRfpStep(3);

            return;
        }


        const messageParts = [];

        if (checkCount > 0) {
            messageParts.push(
                `확인 필요 항목 ${checkCount}건`
            );
        }

        if (detailCount > 0) {
            messageParts.push(
                `구체화 필요 항목 ${detailCount}건`
            );
        }


        if (
            rfpWarningMessage &&
            rfpWarningModal
        ) {

            rfpWarningMessage.textContent =
                `${messageParts.join(", ")} 존재`;

            rfpWarningModal.showModal();

        }

    });

}


if (rfpReviewButton) {

    rfpReviewButton.addEventListener("click", () => {

        if (rfpWarningModal) {
            rfpWarningModal.close();
        }


        const unresolvedItem = Array
            .from(
                document.querySelectorAll(
                    "#rfp-analysis-section .analysis-item"
                )
            )
            .find((item) => {

                return item.querySelector(
                    ".status-check, .status-detail"
                );

            });


        if (unresolvedItem) {

            unresolvedItem.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    });

}


if (rfpConfirmSpecButton) {

    rfpConfirmSpecButton.addEventListener("click", () => {

        if (rfpWarningModal) {
            rfpWarningModal.close();
        }

        showRfpStep(3);

    });

}


if (rfpDraftButton) {

    rfpDraftButton.addEventListener("click", () => {
        showRfpStep(4);
    });

}


rfpPrevButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const stepNumber = Number(
            button.dataset.rfpStep
        );

        showRfpStep(stepNumber);

    });

});

/* ==================================================
   RFP RE-ANALYSIS
================================================== */

const reanalyzeButtons = document.querySelectorAll(
    ".analysis-reanalyze-button"
);

reanalyzeButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const item = button.closest(".analysis-item");
        const input = item.querySelector(".analysis-edit-input");
        const title = item.querySelector(
            ".analysis-item-header > strong"
        );
        const badge = item.querySelector(".status-badge");
        const summary = item.querySelector(".analysis-summary");
        const suggestion = item.querySelector(
            ".analysis-suggestion p"
        );

        const currentValue = input.value.trim();
        const originalValue = input.dataset.original;


        /* 빈 값 */
        if (!currentValue) {
            input.focus();
            return;
        }


        /* 수정하지 않고 다시 분석 */
        if (currentValue === originalValue) {

            badge.textContent = "확인 필요";

            badge.classList.remove(
                "status-ok",
                "status-detail"
            );

            badge.classList.add(
                "status-check"
            );
            summary.textContent =
                "기존 내용과 동일해 추가 구체화가 필요함.";

            updateRfpStatusSummary();

            return;
        }


        /* 수정 후 재분석 */

        title.textContent = currentValue;

        badge.textContent = "구체화 완료";

        badge.classList.remove(
            "status-check",
            "status-detail"
        );

        badge.classList.add(
            "status-ok"
        );

        summary.textContent =
            button.dataset.summary;

        suggestion.textContent =
            button.dataset.suggestion;
       
        input.dataset.original = currentValue;

        updateRfpStatusSummary();
    });

});

updateRfpStatusSummary();

/* ==================================================
   DEMO TYPING
================================================== */

const demoTypingInputs = document.querySelectorAll(
    ".demo-typing-input"
);

demoTypingInputs.forEach((input) => {

    const demoText = input.dataset.demoText;

    let typingStarted = false;
    let typedLength = 0;


    /* 실제 문자 입력 자체를 차단 */
    input.readOnly = true;


    /* 입력창을 클릭하면 커서를 항상 맨 뒤로 이동 */
    input.addEventListener("click", () => {

        const caretPosition = input.value.length;

        input.setSelectionRange(
            caretPosition,
            caretPosition
        );

        input.scrollLeft = input.scrollWidth;

    });


    input.addEventListener("keydown", (event) => {

        /* Ctrl / Alt / Shift 등 기능키는 무시 */
        if (
            event.ctrlKey ||
            event.altKey ||
            event.metaKey ||
            event.key === "Shift" ||
            event.key === "Tab" ||
            event.key.startsWith("Arrow")
        ) {
            return;
        }


        /* Backspace */
        if (event.key === "Backspace") {

            event.preventDefault();

            if (!typingStarted) {
                return;
            }

            typedLength = Math.max(0, typedLength - 1);

            input.value = demoText.slice(
                0,
                typedLength
            );

            const caretPosition = input.value.length;

            input.setSelectionRange(
                caretPosition,
                caretPosition
            );

            input.scrollLeft = input.scrollWidth;

            return;
        }


        /* 텍스트 입력용 키인지 확인 */
        const isTypingKey =
            event.code.startsWith("Key") ||
            event.code.startsWith("Digit") ||
            event.code.startsWith("Numpad") ||
            event.code === "Space" ||
            event.code === "Minus" ||
            event.code === "Equal" ||
            event.code === "BracketLeft" ||
            event.code === "BracketRight" ||
            event.code === "Backslash" ||
            event.code === "Semicolon" ||
            event.code === "Quote" ||
            event.code === "Comma" ||
            event.code === "Period" ||
            event.code === "Slash" ||
            event.code === "Backquote";


        if (!isTypingKey) {
            return;
        }


        event.preventDefault();


        /* 첫 입력 시 기존 문구 대신 새 문장 시작 */
        if (!typingStarted) {
            typingStarted = true;
            typedLength = 0;
        }


        /* 키 1회당 미리 정한 문장 1글자 출력 */
        if (typedLength < demoText.length) {

            typedLength += 1;

            input.value = demoText.slice(
                0,
                typedLength
            );

            const caretPosition = input.value.length;

            input.setSelectionRange(
                caretPosition,
                caretPosition
            );

            input.scrollLeft = input.scrollWidth;
        }

    });

});

/* ==================================================
   DOCUMENT DEMO
================================================== */

const documentStep1 = document.getElementById(
    "document-step-1"
);

const documentStep2 = document.getElementById(
    "document-step-2"
);

const documentUploadArea = document.getElementById(
    "document-upload-area"
);

const documentFileInput = document.getElementById(
    "document-file-input"
);

const documentSelectedFile = document.getElementById(
    "document-selected-file"
);

const documentSelectedFileName = document.getElementById(
    "document-selected-file-name"
);

const documentFileRemoveButton = document.getElementById(
    "document-file-remove-button"
);

const documentConvertButton = document.getElementById(
    "document-convert-button"
);

const documentResultFileName = document.getElementById(
    "document-result-file-name"
);

const documentMarkdownEditor = document.getElementById(
    "document-markdown-editor"
);

const documentPrevButton = document.getElementById(
    "document-prev-button"
);

const documentResetButton = document.getElementById(
    "document-reset-button"
);

const documentDownloadButton = document.getElementById(
    "document-download-button"
);

const documentAiPrompt = document.getElementById(
    "document-ai-prompt"
);

const documentAiApplyButton = document.getElementById(
    "document-ai-apply-button"
);

let documentPromptTypingStarted = false;

let documentPromptTypedLength = 0;


if (documentAiPrompt) {

    const demoPromptText =
        documentAiPrompt.dataset.demoText;


    documentAiPrompt.readOnly = true;


    documentAiPrompt.addEventListener(
        "click",
        () => {

            const caretPosition =
                documentAiPrompt.value.length;

            documentAiPrompt.setSelectionRange(
                caretPosition,
                caretPosition
            );

        }
    );


    documentAiPrompt.addEventListener(
        "keydown",
        (event) => {

            if (
                event.ctrlKey ||
                event.altKey ||
                event.metaKey ||
                event.key === "Shift" ||
                event.key === "Tab" ||
                event.key.startsWith("Arrow")
            ) {
                return;
            }


            if (event.key === "Backspace") {

                event.preventDefault();

                if (!documentPromptTypingStarted) {
                    return;
                }


                documentPromptTypedLength =
                    Math.max(
                        0,
                        documentPromptTypedLength - 1
                    );

                documentAiPrompt.value =
                    demoPromptText.slice(
                        0,
                        documentPromptTypedLength
                    );


                documentAiApplyButton.disabled =
                    documentPromptTypedLength === 0;

                return;
            }


            const isTypingKey =
                event.code.startsWith("Key") ||
                event.code.startsWith("Digit") ||
                event.code.startsWith("Numpad") ||
                event.code === "Space" ||
                event.code === "Minus" ||
                event.code === "Equal" ||
                event.code === "BracketLeft" ||
                event.code === "BracketRight" ||
                event.code === "Backslash" ||
                event.code === "Semicolon" ||
                event.code === "Quote" ||
                event.code === "Comma" ||
                event.code === "Period" ||
                event.code === "Slash" ||
                event.code === "Backquote";


            if (!isTypingKey) {
                return;
            }


            event.preventDefault();


            if (!documentPromptTypingStarted) {

                documentPromptTypingStarted = true;

                documentPromptTypedLength = 0;

            }


            if (
                documentPromptTypedLength <
                demoPromptText.length
            ) {

                documentPromptTypedLength += 1;

                documentAiPrompt.value =
                    demoPromptText.slice(
                        0,
                        documentPromptTypedLength
                    );

            }


            documentAiApplyButton.disabled =
                documentPromptTypedLength === 0;

        }
    );

}

if (
    documentAiApplyButton &&
    documentMarkdownEditor
) {

    documentAiApplyButton.addEventListener(
        "click",
        () => {

            const currentMarkdown =
                documentMarkdownEditor.value;


            const updatedMarkdown =
                currentMarkdown.replace(
                    /^(#{1,5})(\s+)/gm,
                    "#$1$2"
                );


            documentMarkdownEditor.value =
                updatedMarkdown;

            documentAiApplyButton.disabled =
                true;

        }
    );

}

let selectedDocumentFile = null;

let originalDocumentMarkdown = "";


if (documentMarkdownEditor) {

    originalDocumentMarkdown =
        documentMarkdownEditor.value;

}


function setDocumentFile(file) {

    if (!file) {
        return;
    }


    const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");


    if (!isPdf) {
        return;
    }


    selectedDocumentFile = file;

    documentSelectedFileName.textContent =
        file.name;

    documentSelectedFile.hidden = false;

    documentConvertButton.disabled = false;

}


function clearDocumentFile() {

    selectedDocumentFile = null;

    documentFileInput.value = "";

    documentSelectedFileName.textContent = "";

    documentSelectedFile.hidden = true;

    documentConvertButton.disabled = true;

}


if (
    documentUploadArea &&
    documentFileInput
) {

    documentUploadArea.addEventListener(
        "click",
        () => {
            documentFileInput.click();
        }
    );


    documentFileInput.addEventListener(
        "change",
        () => {

            const file =
                documentFileInput.files[0];

            setDocumentFile(file);

        }
    );


    documentUploadArea.addEventListener(
        "dragover",
        (event) => {

            event.preventDefault();

            documentUploadArea.classList.add(
                "drag-over"
            );

        }
    );


    documentUploadArea.addEventListener(
        "dragleave",
        () => {

            documentUploadArea.classList.remove(
                "drag-over"
            );

        }
    );


    documentUploadArea.addEventListener(
        "drop",
        (event) => {

            event.preventDefault();

            documentUploadArea.classList.remove(
                "drag-over"
            );


            const file =
                event.dataTransfer.files[0];

            setDocumentFile(file);

        }
    );

}


if (documentFileRemoveButton) {

    documentFileRemoveButton.addEventListener(
        "click",
        () => {

            clearDocumentFile();

        }
    );

}


if (documentConvertButton) {

    documentConvertButton.addEventListener(
        "click",
        () => {

            if (!selectedDocumentFile) {
                return;
            }


            documentResultFileName.textContent =
                selectedDocumentFile.name;


            documentStep1.classList.add(
                "demo-hidden"
            );

            documentStep2.classList.remove(
                "demo-hidden"
            );


            const documentDemoPanel =
                documentStep2.closest(
                    '.content-panel[data-project="document"][data-view="demo"]'
                );


            if (documentDemoPanel) {

                const heading =
                    documentDemoPanel.querySelector(
                        ".project-heading"
                    );

                if (heading) {

                    heading.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }

        }
    );

}


if (documentPrevButton) {

    documentPrevButton.addEventListener(
        "click",
        () => {

            documentStep2.classList.add(
                "demo-hidden"
            );

            documentStep1.classList.remove(
                "demo-hidden"
            );

        }
    );

}


if (
    documentResetButton &&
    documentMarkdownEditor
) {

    documentResetButton.addEventListener(
        "click",
        () => {

            documentMarkdownEditor.value =
                originalDocumentMarkdown;

            documentAiApplyButton.disabled =
                false;

        }
    );

}


if (
    documentDownloadButton &&
    documentMarkdownEditor
) {

    documentDownloadButton.addEventListener(
        "click",
        () => {

            const markdownContent =
                documentMarkdownEditor.value;

            const markdownBlob = new Blob(
                [markdownContent],
                {
                    type: "text/markdown;charset=utf-8"
                }
            );

            const downloadUrl =
                URL.createObjectURL(markdownBlob);

            const downloadLink =
                document.createElement("a");

            downloadLink.href =
                downloadUrl;

const originalFileName =
    selectedDocumentFile?.name ||
    "converted_document.pdf";

const markdownFileName =
    originalFileName.replace(
        /\.pdf$/i,
        ".md"
    );

downloadLink.download =
    markdownFileName;

            document.body.appendChild(
                downloadLink
            );

            downloadLink.click();

            downloadLink.remove();

            URL.revokeObjectURL(
                downloadUrl
            );

        }
    );

}

/* ==================================================
   MOBILE TEXTAREA RESIZE
================================================== */

const resizableTextareas =
    document.querySelectorAll("textarea");


resizableTextareas.forEach((textarea) => {

    const resizeHandle =
        document.createElement("div");

    resizeHandle.className =
        "mobile-resize-handle";

    textarea.insertAdjacentElement(
        "afterend",
        resizeHandle
    );


    let startY = 0;
    let startHeight = 0;


    resizeHandle.addEventListener(
        "pointerdown",
        (event) => {

            if (
                window.innerWidth > 420
            ) {
                return;
            }


            event.preventDefault();

            startY = event.clientY;
            startHeight =
                textarea.offsetHeight;


            resizeHandle.setPointerCapture(
                event.pointerId
            );

        }
    );


    resizeHandle.addEventListener(
        "pointermove",
        (event) => {

            if (
                window.innerWidth > 420 ||
                !resizeHandle.hasPointerCapture(
                    event.pointerId
                )
            ) {
                return;
            }


            const moveY =
                event.clientY - startY;

            const newHeight =
                Math.max(
                    100,
                    startHeight + moveY
                );


            textarea.style.height =
                `${newHeight}px`;

        }
    );


    resizeHandle.addEventListener(
        "pointerup",
        (event) => {

            if (
                resizeHandle.hasPointerCapture(
                    event.pointerId
                )
            ) {

                resizeHandle.releasePointerCapture(
                    event.pointerId
                );

            }

        }
    );

});

/* ==================================================
   NEWS DEMO
================================================== */

const newsKeywordBox = document.getElementById(
    "news-keyword-box"
);

const newsKeywordTags = document.getElementById(
    "news-keyword-tags"
);

const newsKeywordInput = document.getElementById(
    "news-keyword-input"
);

const newsPeriodButtons = document.querySelectorAll(
    ".news-period-button"
);

const newsStartDate = document.getElementById(
    "news-start-date"
);

const newsEndDate = document.getElementById(
    "news-end-date"
);

const newsDateWarningIcon = document.getElementById(
    "news-date-warning-icon"
);

const newsDateWarningTooltip = document.getElementById(
    "news-date-warning-tooltip"
);

const newsAnalyzeButton = document.getElementById(
    "news-analyze-button"
);

const newsResultSection = document.getElementById(
    "news-result-section"
);

const newsSearchPanel = document.getElementById(
    "news-search-panel"
);

const newsDemoActions = document.getElementById(
    "news-demo-actions"
);

const newsResetButton = document.getElementById(
    "news-reset-button"
);

const newsPdfButton = document.getElementById(
    "news-pdf-button"
);

const newsCalendarButton = document.getElementById(
    "news-calendar-button"
);

const newsRangeCalendar = document.getElementById(
    "news-range-calendar"
);

const newsCalendarMonth = document.getElementById(
    "news-calendar-month"
);

const newsCalendarDays = document.getElementById(
    "news-calendar-days"
);

const newsCalendarPrev = document.getElementById(
    "news-calendar-prev"
);

const newsCalendarNext = document.getElementById(
    "news-calendar-next"
);


let newsKeywords = [];

let calendarViewDate = new Date();

let calendarPendingStart = null;

let calendarSelectingRange = false;

let newsToastTimer = null;

const newsHolidayDates =
    new Set([
        "2026-01-01",
        "2026-02-16",
        "2026-02-17",
        "2026-02-18",
        "2026-03-01",
        "2026-03-02",
        "2026-05-01",
        "2026-05-05",
        "2026-05-24",
        "2026-05-25",
        "2026-06-06",
        "2026-07-17",
        "2026-08-15",
        "2026-08-17",
        "2026-09-24",
        "2026-09-25",
        "2026-09-26",
        "2026-10-03",
        "2026-10-05",
        "2026-10-09",
        "2026-12-25"
    ]);

/* ----------------------------------------------
   Date Helpers
---------------------------------------------- */

function formatNewsDate(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");


    return `${year}-${month}-${day}`;

}


function parseNewsDate(value) {

    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
            value
        )
    ) {
        return null;
    }


    const [
        year,
        month,
        day
    ] = value
        .split("-")
        .map(Number);


    const date =
        new Date(
            year,
            month - 1,
            day
        );


    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }


    return date;

}


function getNewsToday() {

    const now = new Date();


    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

}


function clearNewsPeriodSelection() {

    newsPeriodButtons.forEach(
        (button) => {

            button.classList.remove(
                "active"
            );

        }
    );

}


function setNewsPeriod(days) {

    if (
        !newsStartDate ||
        !newsEndDate
    ) {
        return;
    }


    const today =
        getNewsToday();


    const endDate =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 1
        );


    const startDate =
        new Date(
            endDate
        );


    if (days > 1) {

        startDate.setDate(
            startDate.getDate() -
            (days - 1)
        );

    }


    newsStartDate.value =
        formatNewsDate(
            startDate
        );

    newsEndDate.value =
        formatNewsDate(
            endDate
        );


    calendarPendingStart =
        null;

    calendarSelectingRange =
        false;


    validateNewsDates();

}


/* ----------------------------------------------
   Date Validation
---------------------------------------------- */

function validateNewsDates() {

    if (
        !newsStartDate ||
        !newsEndDate
    ) {
        return true;
    }


    const today =
        getNewsToday();

    const startDate =
        parseNewsDate(
            newsStartDate.value
        );

    const endDate =
        parseNewsDate(
            newsEndDate.value
        );


    const startInvalid =
        Boolean(
            newsStartDate.value &&
            !startDate
        );

    const endInvalid =
        Boolean(
            newsEndDate.value &&
            !endDate
        );


    const startIsFuture =
        Boolean(
            startDate &&
            startDate > today
        );

    const endIsFuture =
        Boolean(
            endDate &&
            endDate > today
        );


    const rangeIsInvalid =
        Boolean(
            startDate &&
            endDate &&
            startDate > endDate
        );


    newsStartDate.classList.toggle(
        "news-date-invalid",
        startInvalid ||
        startIsFuture
    );

    newsEndDate.classList.toggle(
        "news-date-invalid",
        endInvalid ||
        endIsFuture
    );


    if (newsDateWarningIcon) {

        newsDateWarningIcon.hidden =
            !rangeIsInvalid;

    }


    if (
        newsDateWarningTooltip &&
        !rangeIsInvalid
    ) {

        newsDateWarningTooltip
            .classList.remove(
                "visible"
            );

    }


    const hasError =
        startInvalid ||
        endInvalid ||
        startIsFuture ||
        endIsFuture ||
        rangeIsInvalid ||
        !newsStartDate.value ||
        !newsEndDate.value;


    if (newsAnalyzeButton) {

        newsAnalyzeButton.disabled =
            hasError;

    }


    return !hasError;

}


/* ----------------------------------------------
   Warning Tooltip
---------------------------------------------- */

if (
    newsDateWarningIcon &&
    newsDateWarningTooltip
) {

    newsDateWarningIcon.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();


            newsDateWarningTooltip
                .classList.toggle(
                    "visible"
                );

        }
    );

}


/* ----------------------------------------------
   Toast
---------------------------------------------- */

function showNewsToast(message) {

    let toast =
        document.getElementById(
            "news-toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "news-toast";

        toast.className =
            "news-toast";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.classList.add(
        "visible"
    );


    if (newsToastTimer) {

        clearTimeout(
            newsToastTimer
        );

    }


    newsToastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "visible"
                );

            },
            3000
        );

}


/* ----------------------------------------------
   Period Buttons
---------------------------------------------- */

newsPeriodButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                newsPeriodButtons.forEach(
                    (item) => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                setNewsPeriod(
                    Number(
                        button.dataset.days
                    )
                );


                renderNewsCalendar();

            }
        );

    }
);


/* ----------------------------------------------
   Manual Date Input
---------------------------------------------- */

function commitNewsDate(input) {

    clearNewsPeriodSelection();


    const date =
        parseNewsDate(
            input.value
        );

    const today =
        getNewsToday();


    validateNewsDates();


    if (
        date &&
        date > today
    ) {

        showNewsToast(
            "오늘 이후의 날짜는 선택할 수 없습니다."
        );

    }


    renderNewsCalendar();

}


[
    newsStartDate,
    newsEndDate
].forEach((input) => {

    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        () => {

            clearNewsPeriodSelection();

        }
    );


    input.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !==
                "Enter"
            ) {
                return;
            }


            event.preventDefault();

            input.blur();

        }
    );


    input.addEventListener(
        "blur",
        () => {

            commitNewsDate(
                input
            );

        }
    );

});


/* ----------------------------------------------
   Range Calendar
---------------------------------------------- */

function renderNewsCalendar() {

    if (
        !newsCalendarDays ||
        !newsCalendarMonth
    ) {
        return;
    }


    newsCalendarDays.innerHTML =
        "";


    const year =
        calendarViewDate.getFullYear();

    const month =
        calendarViewDate.getMonth();


    newsCalendarMonth.textContent =
        `${year}년 ${month + 1}월`;


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const lastDate =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const today =
        getNewsToday();


    const selectedStart =
        calendarSelectingRange
            ? calendarPendingStart
            : parseNewsDate(
                newsStartDate.value
            );

    const selectedEnd =
        calendarSelectingRange
            ? null
            : parseNewsDate(
                newsEndDate.value
            );


    for (
        let index = 0;
        index < firstDay;
        index += 1
    ) {

        const empty =
            document.createElement(
                "span"
            );

        empty.className =
            "news-calendar-day empty";


        newsCalendarDays.appendChild(
            empty
        );

    }


    for (
        let day = 1;
        day <= lastDate;
        day += 1
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );

        const dateString =
            formatNewsDate(
                date
            );

        const dayOfWeek =
            date.getDay();

        const button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.className =
            "news-calendar-day";

        button.textContent =
            day;

        if (dayOfWeek === 0) {

            button.classList.add(
                "sunday"
            );

        }


        if (dayOfWeek === 6) {

            button.classList.add(
                "saturday"
            );

        }


        if (
            newsHolidayDates.has(
                dateString
            )
        ) {

            button.classList.add(
                "holiday"
            );

        }

        if (date > today) {

            button.disabled =
                true;

        }


        if (
            selectedStart &&
            date.getTime() ===
                selectedStart.getTime()
        ) {

            button.classList.add(
                "range-start"
            );

        }


        if (
            selectedEnd &&
            date.getTime() ===
                selectedEnd.getTime()
        ) {

            button.classList.add(
                "range-end"
            );

        }


        if (
            selectedStart &&
            selectedEnd &&
            date >= selectedStart &&
            date <= selectedEnd
        ) {

            button.classList.add(
                "in-range"
            );

        }


        button.addEventListener(
            "click",
            () => {

                selectNewsCalendarDate(
                    date
                );

            }
        );


        newsCalendarDays.appendChild(
            button
        );

    }


    const nextMonth =
        new Date(
            year,
            month + 1,
            1
        );


    if (newsCalendarNext) {

        newsCalendarNext.disabled =
            nextMonth >
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );

    }

}


function selectNewsCalendarDate(date) {

    if (!calendarSelectingRange) {

        calendarPendingStart =
            new Date(
                date
            );

        calendarSelectingRange =
            true;


        renderNewsCalendar();

        return;

    }


    let startDate =
        new Date(
            calendarPendingStart
        );

    let endDate =
        new Date(
            date
        );


    if (endDate < startDate) {

        const temporaryDate =
            startDate;

        startDate =
            endDate;

        endDate =
            temporaryDate;

    }


    newsStartDate.value =
        formatNewsDate(
            startDate
        );

    newsEndDate.value =
        formatNewsDate(
            endDate
        );


    calendarPendingStart =
        null;

    calendarSelectingRange =
        false;


    clearNewsPeriodSelection();


    validateNewsDates();

    renderNewsCalendar();


    if (newsRangeCalendar) {

        newsRangeCalendar.hidden =
            true;

    }

}

if (newsRangeCalendar) {

    newsRangeCalendar.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

        }
    );

}

if (
    newsCalendarButton &&
    newsRangeCalendar
) {

    newsCalendarButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();


            const startDate =
                parseNewsDate(
                    newsStartDate.value
                );


            if (startDate) {

                calendarViewDate =
                    new Date(
                        startDate.getFullYear(),
                        startDate.getMonth(),
                        1
                    );

            } else {

                const today =
                    getNewsToday();

                calendarViewDate =
                    new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        1
                    );

            }


            calendarPendingStart =
                null;

            calendarSelectingRange =
                false;


            newsRangeCalendar.hidden =
                !newsRangeCalendar.hidden;


            renderNewsCalendar();

        }
    );

}


if (newsCalendarPrev) {

    newsCalendarPrev.addEventListener(
        "click",
        () => {

            calendarViewDate =
                new Date(
                    calendarViewDate.getFullYear(),
                    calendarViewDate.getMonth() - 1,
                    1
                );


            renderNewsCalendar();

        }
    );

}


if (newsCalendarNext) {

    newsCalendarNext.addEventListener(
        "click",
        () => {

            if (
                newsCalendarNext.disabled
            ) {
                return;
            }


            calendarViewDate =
                new Date(
                    calendarViewDate.getFullYear(),
                    calendarViewDate.getMonth() + 1,
                    1
                );


            renderNewsCalendar();

        }
    );

}


/* ----------------------------------------------
   Calendar Outside Click
---------------------------------------------- */

document.addEventListener(
    "click",
    (event) => {

        if (
            newsRangeCalendar &&
            !newsRangeCalendar.hidden &&
            !newsRangeCalendar.contains(
                event.target
            ) &&
            event.target !==
                newsCalendarButton &&
            !newsCalendarButton?.contains(
                event.target
            )
        ) {

            newsRangeCalendar.hidden =
                true;

            calendarPendingStart =
                null;

            calendarSelectingRange =
                false;

        }


        if (
            newsDateWarningTooltip &&
            !newsDateWarningIcon?.contains(
                event.target
            )
        ) {

            newsDateWarningTooltip
                .classList.remove(
                    "visible"
                );

        }

    }
);


/* ----------------------------------------------
   Keyword Tags
---------------------------------------------- */

function renderNewsKeywords() {

    if (!newsKeywordTags) {
        return;
    }


    newsKeywordTags.innerHTML =
        "";


    newsKeywords.forEach(
        (keyword, index) => {

            const tag =
                document.createElement(
                    "span"
                );

            tag.className =
                "news-keyword-tag";


            const text =
                document.createElement(
                    "span"
                );

            text.className =
                "news-keyword-text";

            text.textContent =
                `#${keyword}`;


            const removeButton =
                document.createElement(
                    "button"
                );

            removeButton.type =
                "button";

            removeButton.className =
                "news-keyword-tag-remove";

            removeButton.textContent =
                "×";


            function finishEditing() {

                if (
                    text.contentEditable !==
                    "true"
                ) {
                    return;
                }


                let newKeyword =
                    text.textContent
                        .trim()
                        .replace(
                            /^#+/,
                            ""
                        );


                if (!newKeyword) {

                    newKeyword =
                        newsKeywords[index];

                }


                const isDuplicate =
                    newsKeywords.some(
                        (
                            item,
                            itemIndex
                        ) => {

                            return (
                                itemIndex !== index &&
                                item.toLowerCase() ===
                                    newKeyword.toLowerCase()
                            );

                        }
                    );


                if (!isDuplicate) {

                    newsKeywords[index] =
                        newKeyword;

                }


                text.contentEditable =
                    "false";

                text.textContent =
                    `#${newsKeywords[index]}`;

                tag.classList.remove(
                    "editing"
                );

            }


            function startEditing(event) {

                if (
                    event.target ===
                    removeButton ||
                    removeButton.contains(
                        event.target
                    )
                ) {
                    return;
                }


                text.contentEditable =
                    "true";

                text.textContent =
                    newsKeywords[index];

                tag.classList.add(
                    "editing"
                );


                text.focus();


                const range =
                    document.createRange();

                const selection =
                    window.getSelection();


                range.selectNodeContents(
                    text
                );

                range.collapse(
                    false
                );


                selection.removeAllRanges();

                selection.addRange(
                    range
                );

            }


            tag.addEventListener(
                "click",
                startEditing
            );


            text.addEventListener(
                "keydown",
                (event) => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        text.blur();

                    }


                    if (
                        event.key ===
                        "Escape"
                    ) {

                        event.preventDefault();

                        text.textContent =
                            newsKeywords[index];

                        text.blur();

                    }

                }
            );


            text.addEventListener(
                "blur",
                finishEditing
            );


            removeButton.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();


                    newsKeywords.splice(
                        index,
                        1
                    );


                    renderNewsKeywords();

                }
            );


            tag.appendChild(
                text
            );

            tag.appendChild(
                removeButton
            );


            newsKeywordTags.appendChild(
                tag
            );

        }
    );

}


function addNewsKeyword() {

    if (!newsKeywordInput) {
        return;
    }


    const keyword =
        newsKeywordInput.value
            .trim()
            .replace(
                /^#+/,
                ""
            );


    if (!keyword) {
        return;
    }


    const isDuplicate =
        newsKeywords.some(
            (item) => {

                return (
                    item.toLowerCase() ===
                    keyword.toLowerCase()
                );

            }
        );


    if (!isDuplicate) {

        newsKeywords.push(
            keyword
        );

    }


    newsKeywordInput.value =
        "";


    renderNewsKeywords();


    newsKeywordInput.focus();

}


if (newsKeywordInput) {

    newsKeywordInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !==
                "Enter"
            ) {
                return;
            }


            event.preventDefault();

            addNewsKeyword();

        }
    );

}


if (
    newsKeywordBox &&
    newsKeywordInput
) {

    newsKeywordBox.addEventListener(
        "click",
        (event) => {

            if (
                event.target.closest(
                    ".news-keyword-tag"
                )
            ) {
                return;
            }


            newsKeywordInput.focus();

        }
    );

}

/* ----------------------------------------------
   News Analysis Result
---------------------------------------------- */

if (
    newsAnalyzeButton &&
    newsResultSection
) {

    newsAnalyzeButton.addEventListener(
        "click",
        () => {

            if (
                !validateNewsDates()
            ) {
                return;
            }


            if (newsSearchPanel) {

                newsSearchPanel.hidden =
                    true;

            }


            if (newsDemoActions) {

                newsDemoActions.classList.add(
                    "demo-hidden"
                );

            }

            newsResultSection.hidden =
                false;


            newsResultSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}


if (
    newsResetButton &&
    newsResultSection
) {

    newsResetButton.addEventListener(
        "click",
        () => {

            newsResultSection.hidden =
                true;


            if (newsSearchPanel) {

                newsSearchPanel.hidden =
                    false;

            }


            if (newsDemoActions) {

                newsDemoActions.classList.remove(
                    "demo-hidden"
                );

            }

            if (newsSearchPanel) {

                newsSearchPanel.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

}

/* ----------------------------------------------
   News PDF Download
---------------------------------------------- */

if (newsPdfButton) {

    newsPdfButton.addEventListener(
        "click",
        () => {

            const pdfUrl =
                newsPdfButton.dataset.pdfUrl;


            if (!pdfUrl) {

                showNewsToast(
                    "PDF 파일을 찾을 수 없습니다."
                );

                return;
            }


            const downloadLink =
                document.createElement("a");

            downloadLink.href =
                pdfUrl;

            downloadLink.download =
                "AI_News_Intelligence_2026-10-08_2026-10-14.pdf";


            document.body.appendChild(
                downloadLink
            );

            downloadLink.click();

            downloadLink.remove();

        }
    );

}

/* ----------------------------------------------
   Initial State
---------------------------------------------- */

setNewsPeriod(7);

renderNewsCalendar();