$(function () {
    // 사용자 환경의 모션 축소 설정
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;
    const guideMotionDuration = reduceMotion ? 0 : 250;

    // LNB 전체 열기/닫기
    $(".js-menu-trigger").on("click", function (e) {
        e.preventDefault();

        if ($(window).width() > 1000) {
            return;
        }

        $(this).toggleClass("is-active");
        $(".js-pub-lnb").toggleClass("is-active");
    });

    // 화면 크기별 LNB 기본 상태
    function setLnbState() {
        if ($(window).width() <= 1000) {
            $(".js-pub-lnb").removeClass("is-active");
            $(".js-menu-trigger").removeClass("is-active");
        } else {
            $(".js-pub-lnb").addClass("is-active");
            $(".js-menu-trigger").addClass("is-active");
        }
    }

    setLnbState();

    $(window).on("resize", function () {
        setLnbState();
    });

    // Overlay 메뉴를 전체 가이드 페이지에서 동일하게 구성
    function syncOverlayMenu() {
        var currentPage =
            window.location.pathname.split("/").pop() || "index.html";
        var popupPath =
            currentPage === "index.html" ? "html/popup.html" : "popup.html";
        var overlayItems = [
            ["modal", "modal popup"],
            ["image-banner-layer", "image banner layer"],
            ["alert", "alert"],
            ["confirm", "confirm"],
            ["message-close", "close type"],
            ["bottom-sheet", "bottom sheet"],
            ["bottom-sheet-close", "bottom sheet close"],
            ["bottom-sheet-row", "bottom sheet 2 column"],
            ["terms", "terms view"],
            ["toast", "toast popup"],
        ];

        $(".pub-lnb-depth3")
            .has('a[href*="popup.html#modal"]')
            .each(function () {
                var $menu = $(this).empty();

                overlayItems.forEach(function (item) {
                    $("<li>")
                        .append(
                            $("<a>", {
                                href: popupPath + "#" + item[0],
                                text: item[1],
                            }),
                        )
                        .appendTo($menu);
                });
            });
    }

    function setActiveLnb() {
        var currentPage =
            window.location.pathname.split("/").pop() || "index.html";
        var currentHash = window.location.hash;

        if (!currentHash) {
            currentHash =
                {
                    "index.html": "#basic-policy",
                    "ui.html": "#button",
                    "status.html": "#progress",
                    "popup.html": "#modal",
                }[currentPage] || "";
        }

        $(".pub-lnb-depth2 li, .pub-lnb-depth3 li").removeClass("is-active");
        $(".pub-lnb-depth2 a, .pub-lnb-depth3 a").each(function () {
            var link = this.getAttribute("href") || "";
            var parts = link.split("#");
            var linkPage = parts[0] || currentPage;
            var linkHash = parts[1] ? "#" + parts[1] : "";

            if (linkPage === currentPage && linkHash === currentHash) {
                var $activeItem = $(this).parent("li").addClass("is-active");
                var $depth2Item = $activeItem.closest(".pub-lnb-depth2 > li");
                var $depth1Item = $activeItem.closest(".pub-lnb-item");

                if ($activeItem.parent().hasClass("pub-lnb-depth3")) {
                    $depth2Item
                        .addClass("is-open")
                        .children(".pub-lnb-depth2-btn")
                        .attr("aria-expanded", "true");
                    $depth2Item.children(".pub-lnb-depth3").show();
                }

                $depth1Item
                    .addClass("is-open")
                    .children(".pub-lnb-depth1")
                    .attr("aria-expanded", "true");
                $depth1Item.children(".pub-lnb-depth2").show();
            }
        });
    }

    syncOverlayMenu();
    setActiveLnb();
    $(window).on("hashchange", setActiveLnb);

    // 초기 상태: HTML에 is-open이 있는 메뉴만 펼침
    $(".pub-lnb-item").each(function () {
        var $item = $(this);
        var isOpen = $item.hasClass("is-open");

        $item.children(".pub-lnb-depth1").attr("aria-expanded", String(isOpen));
        $item.children(".pub-lnb-depth2").toggle(isOpen);
    });

    $(".pub-lnb-depth2 > li").each(function () {
        var $item = $(this);
        var isOpen = $item.hasClass("is-open");

        $item
            .children(".pub-lnb-depth2-btn")
            .attr("aria-expanded", String(isOpen));
        $item.children(".pub-lnb-depth3").toggle(isOpen);
    });

    // 1depth 클릭 시 2depth 열기/닫기
    $(".pub-lnb-depth1").on("click", function () {
        var $item = $(this).closest(".pub-lnb-item");
        var $depth2 = $item.children(".pub-lnb-depth2");

        if ($item.hasClass("is-open")) {
            $item.removeClass("is-open");
            $(this).attr("aria-expanded", "false");
            $depth2.stop(true, true).slideUp(guideMotionDuration);
        } else {
            $(".pub-lnb-item")
                .removeClass("is-open")
                .children(".pub-lnb-depth1")
                .attr("aria-expanded", "false")
                .end()
                .children(".pub-lnb-depth2")
                .stop(true, true)
                .slideUp(guideMotionDuration);

            $item.addClass("is-open");
            $(this).attr("aria-expanded", "true");
            $depth2.stop(true, true).slideDown(guideMotionDuration);
        }
    });

    // 2depth 버튼 클릭 시 3depth 열기/닫기
    $(".pub-lnb-depth2-btn").on("click", function () {
        var $item = $(this).closest("li");
        var $depth3 = $item.children(".pub-lnb-depth3");

        if ($item.hasClass("is-open")) {
            $item.removeClass("is-open");
            $(this).attr("aria-expanded", "false");
            $depth3.stop(true, true).slideUp(guideMotionDuration);
        } else {
            $item
                .siblings(".is-open")
                .removeClass("is-open")
                .children(".pub-lnb-depth2-btn")
                .attr("aria-expanded", "false")
                .end()
                .children(".pub-lnb-depth3")
                .stop(true, true)
                .slideUp(guideMotionDuration);

            $item.addClass("is-open");
            $(this).attr("aria-expanded", "true");
            $depth3.stop(true, true).slideDown(guideMotionDuration);
        }
    });

    // 2depth / 3depth 링크 클릭 시 활성화 및 이동
    $(".pub-lnb-depth2 a, .pub-lnb-depth3 a").on("click", function (e) {
        var href = $(this).attr("href") || "";
        var currentPage =
            window.location.pathname.split("/").pop() || "index.html";
        var linkPage = href.split("#")[0] || currentPage;
        var hash =
            href.indexOf("#") > -1 ? href.substring(href.indexOf("#")) : "";
        var $target = linkPage === currentPage && hash ? $(hash) : $();

        $(".pub-lnb-depth2 li, .pub-lnb-depth3 li").removeClass("is-active");
        $(this).parent("li").addClass("is-active");

        if ($target.length) {
            e.preventDefault();

            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, "", hash);
            }

            $("html, body")
                .stop()
                .animate(
                    {
                        scrollTop: $target.offset().top - 80,
                    },
                    reduceMotion ? 0 : 500,
                );

            setActiveLnb();
        }

        if ($(window).width() <= 1000) {
            $(".js-pub-lnb").removeClass("is-active");
            $(".js-menu-trigger").removeClass("is-active");
        }
    });

    // LNB 스와이프 토글
    if ($.fn.swipe) {
        $(".pub").swipe({
            swipe: function (event, direction) {
                if ($(window).width() > 1000) {
                    return;
                }

                if (direction === "left") {
                    $(".js-menu-trigger").removeClass("is-active");
                    $(".js-pub-lnb").removeClass("is-active");
                } else if (direction === "right") {
                    $(".js-menu-trigger").addClass("is-active");
                    $(".js-pub-lnb").addClass("is-active");
                }
            },
            threshold: 5,
            // PC에서는 코드 복사 및 텍스트 선택을 위해 마우스 swipe를 비활성화
            fallbackToMouseEvents: false,
        });
    }

    // Highlight.js
    if (window.hljs) {
        document.querySelectorAll("pre code").forEach(function (code) {
            hljs.highlightBlock(code);
        });
    }

    // 휴대폰 번호 자동 하이픈
    const phoneInputs = document.querySelectorAll(".js-phone-auto");

    phoneInputs.forEach(function (input) {
        input.addEventListener("input", function () {
            // 숫자가 아닌 문자는 모두 제거
            let phoneNumber = this.value.replace(/[^0-9]/g, "");

            // 휴대폰 번호는 최대 11자리까지만 입력
            if (phoneNumber.length > 11) {
                phoneNumber = phoneNumber.slice(0, 11);
            }

            // 입력 길이에 따라 하이픈 추가
            if (phoneNumber.length <= 3) {
                this.value = phoneNumber;
            } else if (phoneNumber.length <= 7) {
                this.value =
                    phoneNumber.slice(0, 3) + "-" + phoneNumber.slice(3);
            } else {
                this.value =
                    phoneNumber.slice(0, 3) +
                    "-" +
                    phoneNumber.slice(3, 7) +
                    "-" +
                    phoneNumber.slice(7);
            }
        });
    });

    /* checkbox - 전체 선택 */
    document.querySelectorAll(".js-check-all").forEach(function (checkAll) {
        const wrap = checkAll.closest(".markup-box");
        const checkItems = wrap.querySelectorAll(".js-check-item");

        checkAll.addEventListener("change", function () {
            checkItems.forEach(function (item) {
                item.checked = checkAll.checked;
            });
        });

        checkItems.forEach(function (item) {
            item.addEventListener("change", function () {
                const checkedCount = wrap.querySelectorAll(
                    ".js-check-item:checked",
                ).length;

                checkAll.checked = checkedCount === checkItems.length;
                checkAll.indeterminate =
                    checkedCount > 0 && checkedCount < checkItems.length;
            });
        });
    });

    /* modal popup */
    let lastFocusedElement = null;
    let termsParentLayer = null;
    let termsFullOpenButton = null;

    function trapFocus(container, event) {
        const focusableElements = Array.from(
            container.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
        ).filter(function (element) {
            return element.offsetParent !== null;
        });

        if (!focusableElements.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    function closeModal(modal) {
        if (!modal) return;

        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");

        if (modal.id === "guide-terms-full" && termsParentLayer) {
            termsParentLayer.classList.add("is-open");
            termsParentLayer.setAttribute("aria-hidden", "false");
            termsFullOpenButton.focus();
            termsParentLayer = null;
            termsFullOpenButton = null;
            return;
        }

        document.body.classList.remove("is-modal-open");

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    document.querySelectorAll(".js-modal-open").forEach(function (button) {
        button.addEventListener("click", function () {
            const modal = document.querySelector(
                this.getAttribute("data-modal-target"),
            );

            if (!modal) return;

            lastFocusedElement = this;
            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("is-modal-open");
            modal.querySelector("button.js-modal-close").focus();
        });
    });

    document.querySelectorAll(".js-modal-close").forEach(function (button) {
        button.addEventListener("click", function () {
            closeModal(this.closest(".ui-modal"));
        });
    });

    // 이미지 배너 슬라이드
    document.querySelectorAll(".js-banner-swiper").forEach(function (slider) {
        const pagination = slider.querySelector(".js-banner-pagination");
        const paginationType = slider.getAttribute("data-pagination-type");

        new Swiper(slider, {
            loop: false,
            speed: 350,
            navigation: {
                prevEl: slider.querySelector(".js-banner-prev"),
                nextEl: slider.querySelector(".js-banner-next"),
            },
            pagination: {
                el: pagination,
                type: paginationType === "bullets" ? "bullets" : "fraction",
                clickable: paginationType === "bullets",
            },
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Tab") {
            const openLayer = document.querySelector(
                ".ui-modal.is-open, .ui-bottom-sheet.is-open",
            );
            if (openLayer) trapFocus(openLayer, event);
        }

        if (event.key === "Escape") {
            closeModal(document.querySelector(".ui-modal.is-open"));

            const sheet = document.querySelector(".ui-bottom-sheet.is-open");
            if (sheet)
                sheet.querySelector("button.js-bottom-sheet-close").click();
        }
    });

    /* tooltip */
    document.querySelectorAll(".ui-tooltip").forEach(function (tooltip) {
        tooltip.addEventListener("keydown", function (event) {
            if (event.key === "Escape") this.classList.add("is-hidden");
        });
        tooltip.addEventListener("focusout", function (event) {
            if (!this.contains(event.relatedTarget))
                this.classList.remove("is-hidden");
        });
        tooltip.addEventListener("mouseenter", function () {
            this.classList.remove("is-hidden");
        });
    });

    /* toast popup */
    let toastTimer = null;

    document.querySelectorAll(".js-toast-open").forEach(function (button) {
        button.addEventListener("click", function () {
            const toast = document.querySelector(
                this.getAttribute("data-toast-target"),
            );

            if (!toast) return;

            window.clearTimeout(toastTimer);
            toast.classList.add("is-open");
            toastTimer = window.setTimeout(function () {
                toast.classList.remove("is-open");
            }, 1000);
        });
    });

    /* tab */
    document.querySelectorAll(".js-tab").forEach(function (tab) {
        const buttons = tab.querySelectorAll('[role="tab"]');
        const panels = tab.querySelectorAll('[role="tabpanel"]');

        buttons.forEach(function (button, index) {
            button.addEventListener("click", function () {
                buttons.forEach(function (item) {
                    item.setAttribute("aria-selected", "false");
                    item.setAttribute("tabindex", "-1");
                });
                panels.forEach(function (panel) {
                    panel.hidden = true;
                });

                button.setAttribute("aria-selected", "true");
                button.removeAttribute("tabindex");
                panels[index].hidden = false;
            });

            button.addEventListener("keydown", function (event) {
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
                    return;

                event.preventDefault();
                const direction = event.key === "ArrowRight" ? 1 : -1;
                const nextIndex =
                    (index + direction + buttons.length) % buttons.length;
                buttons[nextIndex].click();
                buttons[nextIndex].focus();
            });
        });
    });

    /* accordion */
    document
        .querySelectorAll(".js-accordion .ui-accordion-button")
        .forEach(function (button) {
            button.addEventListener("click", function () {
                const panel = document.getElementById(
                    this.getAttribute("aria-controls"),
                );
                const isOpen = this.getAttribute("aria-expanded") === "true";

                if (!panel) return;

                this.setAttribute("aria-expanded", String(!isOpen));

                if (isOpen) {
                    if (
                        window.matchMedia("(prefers-reduced-motion: reduce)")
                            .matches
                    ) {
                        panel.classList.remove("is-open");
                        panel.style.maxHeight = "0px";
                        panel.hidden = true;
                        return;
                    }
                    panel.style.maxHeight = panel.scrollHeight + "px";
                    requestAnimationFrame(function () {
                        panel.classList.remove("is-open");
                        panel.style.maxHeight = "0px";
                    });
                    panel.addEventListener(
                        "transitionend",
                        function () {
                            panel.hidden = true;
                        },
                        { once: true },
                    );
                    return;
                }

                if (this.closest("ul.js-accordion")) {
                    this.closest("ul.js-accordion")
                        .querySelectorAll(
                            '.ui-accordion-button[aria-expanded="true"]',
                        )
                        .forEach(function (openButton) {
                            if (openButton !== button) openButton.click();
                        });
                }

                panel.hidden = false;
                panel.style.maxHeight = "0px";

                if (reduceMotion) {
                    panel.classList.add("is-open");
                    panel.style.maxHeight = "none";
                    return;
                }

                // 시작 높이를 먼저 반영해 열림 모션이 생략되지 않게 한다.
                panel.offsetHeight;
                requestAnimationFrame(function () {
                    panel.classList.add("is-open");
                    panel.style.maxHeight = panel.scrollHeight + 16 + "px";
                });
                panel.addEventListener(
                    "transitionend",
                    function () {
                        if (button.getAttribute("aria-expanded") === "true") {
                            panel.style.maxHeight = "none";
                        }
                    },
                    { once: true },
                );
            });
        });

    /* file name */
    document.querySelectorAll(".js-file").forEach(function (input) {
        input.addEventListener("change", function () {
            const name = document.querySelector(
                this.getAttribute("data-file-name"),
            );
            if (name) name.value = this.files.length ? this.files[0].name : "";
        });
    });

    /* bottom sheet */
    document.querySelectorAll(".js-terms-open").forEach(function (button) {
        button.addEventListener("click", function () {
            const target = window.matchMedia("(max-width: 768px)").matches
                ? document.querySelector("#guide-terms-sheet")
                : document.querySelector("#guide-terms-modal");

            if (!target) return;

            lastFocusedElement = this;
            target.classList.add("is-open");
            target.setAttribute("aria-hidden", "false");
            document.body.classList.add("is-modal-open");
            target.querySelector(".js-terms-full-open, .js-modal-close").focus();
        });
    });

    document.querySelectorAll(".js-terms-full-open").forEach(function (button) {
        button.addEventListener("click", function () {
            const parentLayer = this.closest(
                ".ui-bottom-sheet, .ui-modal:not(.ui-modal-full)",
            );
            const fullModal = document.querySelector("#guide-terms-full");

            if (!fullModal) return;

            if (parentLayer) {
                termsParentLayer = parentLayer;
                termsFullOpenButton = this;
                parentLayer.classList.remove("is-open", "is-opening", "is-closing");
                parentLayer.setAttribute("aria-hidden", "true");
            }

            fullModal.classList.add("is-open");
            fullModal.setAttribute("aria-hidden", "false");
            fullModal.querySelector(".js-modal-close").focus();
        });
    });

    document
        .querySelectorAll(".js-bottom-sheet-open")
        .forEach(function (button) {
            button.addEventListener("click", function () {
                const sheet = document.querySelector(
                    this.getAttribute("data-bottom-sheet-target"),
                );

                if (!sheet) return;

                lastFocusedElement = this;
                sheet.classList.remove("is-closing");
                sheet.classList.add("is-opening");
                sheet.classList.add("is-open");
                sheet.setAttribute("aria-hidden", "false");
                document.body.classList.add("is-modal-open");
                sheet.querySelector("button.js-bottom-sheet-close").focus();

                window.requestAnimationFrame(function () {
                    window.requestAnimationFrame(function () {
                        sheet.classList.remove("is-opening");
                    });
                });
            });
        });

    document
        .querySelectorAll(".js-bottom-sheet-close")
        .forEach(function (button) {
            button.addEventListener("click", function () {
                const sheet = this.closest(".ui-bottom-sheet");

                if (!sheet || sheet.classList.contains("is-closing")) return;

                const closeDelay = window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                ).matches
                    ? 0
                    : 250;

                sheet.classList.add("is-closing");
                sheet.setAttribute("aria-hidden", "true");

                window.setTimeout(function () {
                    sheet.classList.remove("is-open", "is-closing");
                    document.body.classList.remove("is-modal-open");

                    if (lastFocusedElement) lastFocusedElement.focus();
                }, closeDelay);
            });
        });
});
