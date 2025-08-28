function darkMode() {
    localStorage.setItem("mode", "darkmode" === localStorage.getItem("mode") ? "light" : "darkmode"), "darkmode" === localStorage.getItem("mode") ? document.querySelector("#mainCont").classList.add("drK") : document.querySelector("#mainCont").classList.remove("drK")
};

function gridMode() {
    localStorage.setItem("list", "listmode" === localStorage.getItem("list") ? "grid" : "listmode"), "listmode" === localStorage.getItem("list") ? document.querySelector("#mainCont").classList.remove("grD") : document.querySelector("#mainCont").classList.add("grD")
};


! function (o) {
    o.fn.lazyier = function () {
        return this.each(function () {
            var t = o(this),
                a = o(window),
                n = t.attr("data-image"),
                e = "w" + Math.round(t.width() + t.width() / 10) + "-h" + Math.round(t.height() + t.height() / 10) + "-p-k-no-nu",
                r = "";
            n.match("resources.blogblog.com") && (n = noThumbnail), r = n.match("/s72-c") ? n.replace("/s72-c", "/" + e) : n.match("/w72-h") ? n.replace("/w72-h72-p-k-no-nu", "/" + e) : n.match("=w72-h") ? n.replace("=w72-h72-p-k-no-nu", "=" + e) : n, t.is(":hidden") || a.on("load resize scroll", function o() {
                if (a.scrollTop() + a.height() >= t.offset().top) {
                    a.off("load resize scroll", o);
                    var n = new Image;
                    n.onload = function () {
                        t.attr("style", "background-image:url(" + this.src + ")").addClass("klazy")
                    }, n.src = r
                }
            }).trigger("scroll")
        })
    }
}(jQuery);





"use strict";

function t(container, widgetType, itemCount, label) {
    if (!(widgetType.match("recent-label") || widgetType.match("recent-flash") || widgetType.match("mega-menus") || widgetType.match("related"))) return;

    var feedUrl;
    if (label === "recent") {
        feedUrl = "/feeds/posts/default?alt=json-in-script&max-results=" + itemCount;
    } else if (label === "random") {
        var startIndex = Math.floor(Math.random() * itemCount) + 1;
        feedUrl = "/feeds/posts/default?max-results=" + itemCount + "&start-index=" + startIndex + "&alt=json-in-script";
    } else {
        feedUrl = "/feeds/posts/default/-/" + label + "?alt=json-in-script&max-results=" + itemCount;
    }

    $.ajax({
        url: feedUrl,
        type: "get",
        dataType: "jsonp",
        beforeSend: function () {
            if (widgetType.match("recent-label")) container.html("").addClass("loading-icon");
        },
        success: function (data) {
            var htmlOutput = "";
            if (data.feed.entry) {
                data.feed.entry.forEach(function (entry) {

                    var postUrl = (entry.link.find(l => l.rel === "alternate") || {}).href || "";
                    if (postUrl === window.location.href) return;
                    var postId = (entry.id.$t || "").split("post-")[1] || "";
                    var itemId = "dual-" + postId;
                    var title = entry.title.$t || "";
                    var contentHtml = entry.content.$t || "";
                    var $tempDiv = $("<div>").html(contentHtml);

                    var firstImg = $tempDiv.find("img:first").attr("src") || noThumbnail;
                    var thumb = firstImg.replace(/s\d{3,4}/, "w400");
                    var hoverThumb = $tempDiv.find("img:eq(1)").attr("src") || "";
                    hoverThumb = hoverThumb ? hoverThumb.replace(/s\d{3,4}/, "w400") : "";

                    var priceMatch = contentHtml.match(/price\/([^\n\r<]+)/),
                        oldPriceMatch = contentHtml.match(/priceold\/([^\n\r<]+)/),
                        discountMatch = contentHtml.match(/off\/([^\n\r<]+)/),
                        stockMatch = contentHtml.match(/stock\/([^\n\r<]+)/);
                    var basePrice = priceMatch ? parseFloat(priceMatch[1]) : 0;
                    var priceHTML = priceMatch ? SimpleCart.toCurrency(basePrice) : "";
                    var oldPriceHTML = oldPriceMatch ? SimpleCart.toCurrency(parseFloat(oldPriceMatch[1])) : "";
                    var discountHTML = discountMatch ? discountMatch[1] : "";
                    var stockHTML = stockMatch ? stockMatch[1].trim() : "";

                    var variantLines = [];
                    $tempDiv.find("strike").each(function () {
                        var txt = ($(this).text() || "").trim();
                        if (/^variant\//i.test(txt)) variantLines.push(txt);
                    });

                    htmlOutput += `
<article class="ntry is_post SimpleCart_shelfItem shopping-item index-post post-shop-info product pbt-u field_loaded"
         data-id="${postId}" data-base-price="${basePrice}">
  <span class="item_id hidden">${itemId}</span>
  <div class="pThmb">
    <a class="thmb" href="${postUrl}">
      <img alt="${title}" class="imgThm item_thumb lazy"  data-src="${thumb}">
      ${hoverThumb ? `<img class="hoverThumb" src="${hoverThumb}">` : ""}
      ${discountHTML ? `<span class="prodct_discount show">${discountHTML}</span>` : ""}
    </a>
  </div>
  <div class="pCntn greez">
    <div class="pTtl aTtl entry-title item_name">
      <a href="${postUrl}" title="${title}">${title}</a>
    </div>
    <div class="b-price" data-base-price="${basePrice}">
      ${priceHTML ? `<span class="azonshop_perga_product item_price show"><span class="azonshop-price perga">${priceHTML}</span></span>` : ""}
      ${oldPriceHTML ? `<span class="azonshop_perga_product show"><span class="discount">${oldPriceHTML}</span></span>` : ""}
    </div>
    <div class="drawer55"></div>
    <div class="b-cart">
      ${
        (stockHTML && stockHTML.toLowerCase().includes("no"))
          ? `<a class="outCart butn" href="javascript:;"> Out of Stock </a>`
          : `<a class="item_add butn" href="javascript:;"> Add to Cart </a>`
      }
<div class="pbt-l" data-id="${postId}" data-thumb="${thumb}" data-title="${title}" data-url="${postUrl}">
        <button aria-label="Add to Wish List" class="pbt-love like tooltip"></button>
        <button aria-label="Remove From Wish List" class="pbt-love unlike tooltip"></button>
      </div>
    </div>
  </div>
</article>`;

                    setTimeout(function () {
                        var $article = container.find(`.SimpleCart_shelfItem[data-id='${postId}']`);
                        if (variantLines.length) {
                            $article.find(".item_add").addClass("op_add").removeClass("item_add");
                            var $drawer = VariantDrawer.create(variantLines, $article);
                            $article.append($drawer);
                        }
                    }, 10);

                });
            }

            container.removeClass("loading-icon").html(htmlOutput);
            if (widgetType.match("recent-label")) container.addClass("recent-label bow");
            else if (widgetType.match("recent-flash")) container.addClass("recent-widget no-bow");
            else if (widgetType.match("mega-menus")) container.addClass("mega-neds");
            else if (widgetType.match("related")) container.addClass("related-posts bow");

            defer.dom(".lazy", 20, "loaded", null, {
                rootMargin: "-20px 0px -151px 0px"
            });
            refreshCartUI();






        }
    });
}







$(function () {

    Defer.dom(".recent-section", 150, "visible", () => {

        $(".recent-section .widget-content").each(function () {
            var e = $(this),
                s = e.text().trim();
            t(e, s.toLowerCase(), 6, s.split("/")[0])
        })

    }, {
        rootMargin: "0px 0px -200px 0px",
        threshold: 0.1
    });


    $(".mega-menus .mega-sub").each(function () {
        var e = $(this),
            s = e.text().trim();
        t(e, s.toLowerCase(), 4, s.split("/")[0])
    }), $(".flash-wrap .widget-content").each(function () {
        var e = $(this),
            s = e.text().trim();
        t(e, s.toLowerCase(), (s = s.split("/"))[0], s[1])
    }), $(".related-ready").each(function () {
        var e = $(this),
            s = e.find(".related-tag").data("label");
        t(e, "related", 4, s)
    })

    $(".post-shop-info").each(function () {
        var $postBox = $(this),
            postId = $postBox.data("id");

        $.ajax({
            url: "/feeds/posts/default/" + postId + "?alt=json",
            type: "get",
            dataType: "jsonp",
            success: function (res) {
                var content = res.entry.content.$t,
                    $tempDiv = $("<div>").html(content);

                var priceMatch = content.match(/price\/([^\n\r<]+)/);
                var oldPriceMatch = content.match(/priceold\/([^\n\r<]+)/);
                var discountMatch = content.match(/off\/([^\n\r<]+)/);
                var stockMatch = content.match(/stock\/([^\n\r<]+)/);

                var basePrice = priceMatch ? parseFloat(priceMatch[1]) : 0;
                var priceHTML = priceMatch ? SimpleCart.toCurrency(basePrice) : "";
                var oldPriceHTML = oldPriceMatch ? SimpleCart.toCurrency(parseFloat(oldPriceMatch[1])) : "";
                var discountHTML = discountMatch ? discountMatch[1] : "";
                var stockHTML = stockMatch ? stockMatch[1].trim() : "";

                $postBox.attr("data-base-price", basePrice);
                if (priceHTML) $postBox.find(".perga").html(priceHTML).parent().addClass("show");
                if (oldPriceHTML) $postBox.find(".discount").html(oldPriceHTML).parent().addClass("show");
                if (discountHTML) $postBox.find(".prodct_discount").text(discountHTML).addClass("show");
                if (stockHTML && stockHTML.toLowerCase().includes("no")) $postBox.find(".item_add").remove();

                var variantLines = [];
                $tempDiv.find("strike").each(function () {
                    var txt = ($(this).text() || "").trim();
                    if (/^variant\//i.test(txt)) variantLines.push(txt);
                });

                if (variantLines.length) {
                    $postBox.find(".item_add").addClass("op_add").removeClass("item_add");
                    var $drawer = VariantDrawer.create(variantLines, $postBox);
                    $postBox.append($drawer);

                }


                var itemId = "dual-" + postId;

                var $idSpan = $postBox.find(".item_id");
                if ($idSpan.length) {
                    $idSpan.text(itemId);
                } else {
                    $postBox.append('<span class="item_id hidden">' + itemId + '</span>');
                }




            }
        });
    });




});



var VariantDrawer = {
    create: function (variantLines, $product) {
        var productImg = $product.find("img").attr("data-src") || "";
        var productTitle = $product.find(".pTtl").text() || "Product";
        var basePrice = parseFloat($product.attr("data-base-price")) || 0;
        var discountHTML = $product.find(".prodct_discount").text() || "";
        var oldPriceHTML = $product.find(".discount").text() || "";

        var $drawer = $(`
        <div class="variant-drawer" style="display:none;">
            <div class="drawer-overlay"></div>
            <div class="drawer-mbl">
                <div class="drawer-overlay"></div>
                <div class="drawer-content">
                    <div class="drawer-head">
                        <h3>Select Options</h3>
                        <span class="flexon"></span>
                        <button class="drawer-close">&times;</button>
                    </div>
                    <div class="drawer-items">
                        <div class="drawer-header">
                            <img src="${productImg}" class="drawer-thumb">
                            ${discountHTML ? `<span class="prodct_discount show">${discountHTML}</span>` : ""}
                            <div class="drawer-info">
                                <h3 class="drawer-title">${productTitle}</h3>
                                <div class="drawer-price">
                                    <span class="azonshop_perga_product show">
                                        <span class="azonshop-price perga">${SimpleCart.toCurrency(basePrice)}</span>
                                    </span>
                                    ${oldPriceHTML ? `<span class="azonshop_perga_product show"><span class="discount">${oldPriceHTML}</span></span>` : ""}
                                    <span class="flexon"></span>
                                </div>
                            </div>
                        </div>
                        <div class="drawer-body"></div>
                    </div>
                    <div class="drawer-footer">
                        <button class="confirm-variant item_add butn">Add to Cart</button>
<div class='quantity' style='display:none'>
   <div class='inputWrap'>
    <input class='item_Quantity' max='10' min='0' type='number' value='0'/>
    <span class='qty-text'>in Cart</span>
   </div> </div>
                    </div>
                </div>
            </div>
        </div>`);

        var $body = $drawer.find(".drawer-body");

        variantLines.forEach(function (line) {
            line = line.replace(/<\/?strike>/gi, "").trim();
            if (!/^variant\//i.test(line)) return;

            var parts = line.split("/"),
                groupName = (parts[1] || "").trim(),
                options = parts.slice(2),
                key = groupName.toLowerCase().replace(/\s+/g, ""),
                $hiddenSelect = $('<select class="item_' + key + '" style="display:none;"></select>');

            var $group = $('<div class="variant-group"></div>').data("variant-key", key);
            $group.append('<div class="variant-label">' + groupName + ':<span class="choosed"></span></div>');

            var $opts = $('<div class="variant-options"></div>');
            options.forEach(function (opt, idx) {
                var m = opt.match(/^(.*?)(?:\[\+([\d.]+)\])?$/),
                    val = m[1].trim(),
                    adj = parseFloat(m[2]) || 0;

                var $opt = $('<span class="variant-option"></span>')
                    .attr("data-value", val)
                    .attr("data-price-adj", adj);

                if (key === "color") {
                    $opt.addClass("color-swatch").css("background-color", val).attr("title", val);
                } else {
                    $opt.addClass("text-option").text(val);
                }

                if (adj > 0) {
                    $opt.append('<small class="price-adj">+' + SimpleCart.toCurrency(adj) + "</small>");
                }

                if (idx === 0) {
                    $opt.addClass("selected");
                    $hiddenSelect.append('<option value="' + val + '" selected>' + val + "</option>");
                }

                $opts.append($opt);
            });

            $group.append($opts);
            $body.append($group).append($hiddenSelect);
        });

        this.bindEvents($drawer, $product);

        return $drawer;
    },

    bindEvents: function ($drawer, $product) {

        var self = this;

        $(document).on("click", ".op_add", function (e) {
            e.preventDefault();
            var $item = $(this).closest(".SimpleCart_shelfItem");
            var $drawer = $item.find(".variant-drawer");
            if ($drawer.length) {
                $drawer.fadeIn(300).addClass("open");
                VariantDrawer.updatePrice($item, $drawer);
                syncInputsFromCart($item);

            }
        });

        $drawer.on("click", ".variant-option", function () {
            var $opt = $(this);
            $opt.siblings().removeClass("selected");
            $opt.addClass("selected");
            self.updatePrice($product, $drawer);
            syncInputsFromCart($product);
        });

        $drawer.find(".confirm-variant").on("click", function () {
            var $item = $product;


            flyingElementToTarget(this, ".isCart", '<svg ...></svg>', ["#ff4d4d", "#ff66cc"]);
        });



        $drawer[0].addEventListener("touchstart", function (e) {
            const t = e.touches[0];
            startX = t.clientX;
            startY = t.clientY;
        }, {
            passive: true
        });

        $drawer[0].addEventListener("touchend", function (e) {
            const t = e.changedTouches[0];
            const dx = t.clientX - startX;
            const dy = t.clientY - startY;

            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            if ((absDx > 50 && dx > 0) || (absDy > 50 && dy > 0)) {
                self.reset($product, $drawer);
                $drawer.fadeOut(300).removeClass("open"); // ✅ reuse your close function
            }
        }, {
            passive: true
        });

        $drawer.find(".drawer-close, .drawer-overlay").on("click", function () {
            self.reset($product, $drawer);
            $drawer.fadeOut(300).removeClass("open");
        });
    },

    updatePrice: function ($product, $drawer) {
        var base = parseFloat($product.attr("data-base-price")) || 0;
        var total = base;

        var variants = []; // collect selected variant values

        $drawer.find(".variant-group").each(function () {
            var $group = $(this),
                $sel = $group.find(".variant-option.selected"),
                key = $group.data("variant-key"),
                adj = parseFloat($sel.data("price-adj")) || 0,
                val = $sel.data("value") || "";

            total += adj;

            var $hsel = $product.find(".item_" + key);
            if (!$hsel.length) {
                $hsel = $('<select class="item_' + key + '" style="display:none;"></select>');
                $product.append($hsel);
            }
            $hsel.html('<option value="' + val + '" selected></option>');

            var prettyVal = val.charAt(0).toUpperCase() + val.slice(1);
            $group.find(".choosed").text(prettyVal + " Selected");

            if (val) variants.push(val);
        });

        var productID = $product.attr("data-id");
        var itemId, variantHtml;

        if (variants.length === 1) {
            itemId = "dual-" + productID + variants[0];
            variantHtml = '<span class="allvarian">' + variants[0] + "</span>";
        } else if (variants.length >= 2) {
            itemId = "dual-" + productID + variants.join("-");
            variantHtml = '<span class="allvarian">' + variants.join("-") + "</span>";
        } else {
            itemId = "dual-" + productID;
            variantHtml = "";
        }

        var $idSpan = $product.find(".item_id");
        if ($idSpan.length) {
            $idSpan.text(itemId);
        } else {
            $product.append('<span class="item_id hidden">' + itemId + '</span>');
        }

        $product.find(".variant-summary").remove(); // clear old
        if (variantHtml) $product.append('<div class="variant-summary">' + variantHtml + '</div>');

        $drawer.find(".drawer-price .perga").html(SimpleCart.toCurrency(total));
        $product.find(".item_price .azonshop-price").text(SimpleCart.toCurrency(total));
    },

    reset: function ($product, $drawer) {
        $drawer.find(".variant-group").each(function () {
            var $opts = $(this).find(".variant-option");
            $opts.removeClass("selected");
            $opts.first().addClass("selected");
        });

        this.updatePrice($product, $drawer);
    }
};










function refreshCartUI() {
    const cartD = SimpleCart.items(); // get all cart items instead of just ids

    document.querySelectorAll(".SimpleCart_shelfItem").forEach(item => {
        const baseId = item.getAttribute("data-id");
        if (!baseId) return;

        const relatedItems = cartD.filter(ci => ci.get("id").includes(baseId));
        const totalQty = relatedItems.reduce((sum, ci) => sum + ci.quantity(), 0);

        let incartIcon = item.querySelector(".incart");

        if (totalQty > 0) {
            if (!incartIcon) {
                incartIcon = document.createElement("div");
                incartIcon.className = "incart";
                incartIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#0000F5">
                      <path d="M206-120q-20 0-36.5-12T148-164L38-562q-4-14 5-26t24-12h202l185-270q5-6 11-9.5t14-3.5q8 0 14 3.5t11 9.5l184 270h206q15 0 24 12t5 26L812-164q-5 20-21.5 32T754-120H206Zm274-180q25 0 42.5-17.5T540-360q0-25-17.5-42.5T480-420q-25 0-42.5 17.5T420-360q0 25 17.5 42.5T480-300ZM342-600h273L479-800 342-600Z"/>
                    </svg>
                    <span class="incart-count total_quantity">${totalQty}</span>
                `;

                let thumb = item.querySelector(".pThmb");
                if (thumb) thumb.appendChild(incartIcon);
            } else {

                const countSpan = incartIcon.querySelector(".incart-count");
                if (countSpan) countSpan.textContent = totalQty;
            }
        } else {
            if (incartIcon) incartIcon.remove();
        }
    });
}


function refreshSinglePostCart(baseId) {
    const cartItems = SimpleCart.items();
    const productItems = cartItems.filter(ci => ci.get("id").includes(baseId));

    const detailsBox = document.querySelector(".devin");
    if (!detailsBox) return;

    if (productItems.length === 0) {
        detailsBox.innerHTML = "<p>No variants in cart.</p>";
        return;
    }

    let html = "<ul>";
    productItems.forEach(ci => {
        const parts = ci.get("id").split("-");

        const color = parts[2] || "";
        const size = parts[3] || "";
        const qty = ci.quantity();

        html += `<li>Color ${color} • Size ${size} × ${qty}</li>`;
    });
    html += "</ul>";

    detailsBox.innerHTML = html;
}

SimpleCart.bind("update", function () {
    const baseId = document.querySelector(".product-wrap")?.getAttribute("data-id");
    if (baseId) refreshSinglePostCart(baseId);
});










$(document).on("click", ".incart", function () {
    $("#shoppycart").toggleClass("shoppycart-open");
});




(function () {
    var youtube = document.querySelectorAll(".lazyYt");
    for (var i = 0; i < youtube.length; i++) {
        var source = "https://img.youtube.com/vi/" + youtube[i].dataset.embed + "/sddefault.jpg";
        var image = new Image();
        image.setAttribute("class", "lazy");
        image.setAttribute("data-src", source);
        image.setAttribute("src", "data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=");
        image.setAttribute("alt", "Youtube video");
        image.addEventListener("load", function () {
            youtube[i].appendChild(image);
        }(i));
        youtube[i].addEventListener("click", function () {
            var iframe = document.createElement("iframe");
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allowfullscreen", "");
            iframe.setAttribute("src", "https://www.youtube.com/embed/" + this.dataset.embed + "?rel=0&showinfo=0&autoplay=1");
            this.innerHTML = "";
            this.appendChild(iframe);
        });
    };
})();

for (var imageslazy = document.querySelectorAll('.pS .separator img, .pS .tr-caption-container img, .pS .psImg >img, .pS .btImg >img'), i = 0; i < imageslazy.length; i++) imageslazy[i].setAttribute('onclick', 'return false');

function wrap(o, t, e) {
    for (var i = document.querySelectorAll(t), c = 0; c < i.length; c++) {
        var a = o + i[c].outerHTML + e;
        i[c].outerHTML = a
    }
}
wrap('<div class="zmImg">', '.pS .separator >a', '</div>');
wrap('<div class="zmImg">', '.pS .tr-caption-container td >a', '</div>');
wrap('<div class="zmImg">', '.pS .separator >img', '</div>');
wrap('<div class="zmImg">', '.pS .tr-caption-container td >img', '</div>');
wrap('<div class="zmImg">', '.pS .psImg >img', '</div>');
wrap('<div class="zmImg">', '.pS .btImg >img', '</div>');
for (var containerimg = document.getElementsByClassName('zmImg'), i = 0; i < containerimg.length; i++) containerimg[i].onclick = function () {
    this.classList.toggle('s');
};
Defer.dom('.lazy', 100, 'loaded', null, {
    rootMargin: '1px'
}), 'undefined' != typeof infinite_scroll && infinite_scroll.on('load', function () {
    Defer.dom('.lazy', 100, 'loaded', null, {
        rootMargin: '1px'
    })
});


var Shortcode = function (el, tags) {
    if (!el) {
        return
    }
    this.el = el;
    this.tags = tags;
    this.matches = [];
    this.regex = '\\[{name}(\\s[\\s\\S]*?)?\\]' + '(?:((?!\\s*?(?:\\[{name}|\\[\\/(?!{name})))[\\s\\S]*?)' + '(\\[\/{name}\\]))?';
    if (this.el.jquery) {
        this.el = this.el[0]
    }
    this.matchTags();
    this.convertMatchesToNodes();
    this.replaceNodes()
};
Shortcode.prototype.matchTags = function () {
    var html = this.el.outerHTML,
        instances, match, re, contents, regex, tag, options;
    for (var key in this.tags) {
        if (!this.tags.hasOwnProperty(key)) {
            return
        }
        re = this.template(this.regex, {
            name: key
        });
        instances = html.match(new RegExp(re, 'g')) || [];
        for (var i = 0, len = instances.length; i < len; i++) {
            match = instances[i].match(new RegExp(re));
            contents = match[3] ? '' : undefined;
            tag = match[0];
            regex = this.escapeTagRegExp(tag);
            options = this.parseOptions(match[1]);
            if (match[2]) {
                contents = match[2].trim();
                tag = tag.replace(contents, '').replace(/\n\s*/g, '');
                regex = this.escapeTagRegExp(tag).replace('\\]\\[', '\\]([\\s\\S]*?)\\[')
            }
            this.matches.push({
                name: key,
                tag: tag,
                regex: regex,
                options: options,
                contents: contents
            })
        }
    }
};
Shortcode.prototype.convertMatchesToNodes = function () {
    var html = this.el.innerHTML,
        excludes, re, replacer;
    replacer = function (match, p1, p2, p3, p4, offset, string) {
        if (p1) {
            return match
        } else {
            var node = document.createElement('span');
            node.setAttribute('data-sc-tag', this.tag);
            node.className = 'sc-node sc-node-' + this.name;
            return node.outerHTML
        }
    };
    for (var i = 0, len = this.matches.length; i < len; i++) {
        excludes = '((data-sc-tag=")|(<pre.*)|(<code.*))?';
        re = new RegExp(excludes + this.matches[i].regex, 'g');
        html = html.replace(re, replacer.bind(this.matches[i]))
    }
    this.el.innerHTML = html
};
Shortcode.prototype.replaceNodes = function () {
    var self = this,
        html, match, result, done, node, fn, replacer, nodes = this.el.querySelectorAll('.sc-node');
    replacer = function (result) {
        if (result.jquery) {
            result = result[0]
        }
        result = self.parseCallbackResult(result);
        node.parentNode.replaceChild(result, node)
    };
    for (var i = 0, len = this.matches.length; i < len; i++) {
        match = this.matches[i];
        node = this.el.querySelector('.sc-node-' + match.name);
        if (node && node.dataset.scTag === match.tag) {
            fn = this.tags[match.name].bind(match);
            done = replacer.bind(match);
            result = fn(done);
            if (result !== undefined) {
                done(result)
            }
        }
    }
};
Shortcode.prototype.parseCallbackResult = function (result) {
    var container, fragment, children;
    switch (typeof result) {
    case 'function':
        result = document.createTextNode(result());
        break;
    case 'string':
        container = document.createElement('div');
        fragment = document.createDocumentFragment();
        container.innerHTML = result;
        children = container.childNodes;
        if (children.length) {
            for (var i = 0, len = children.length; i < len; i++) {
                fragment.appendChild(children[i].cloneNode(true))
            }
            result = fragment
        } else {
            result = document.createTextNode(result)
        }
        break;
    case 'object':
        if (!result.nodeType) {
            result = JSON.stringify(result);
            result = document.createTextNode(result)
        }
        break;
    case 'default':
        break
    }
    return result
};
Shortcode.prototype.parseOptions = function (stringOptions) {
    var options = {},
        set;
    if (!stringOptions) {
        return
    }
    set = stringOptions.replace(/(\w+=)/g, '\n$1').split('\n');
    set.shift();
    for (var i = 0; i < set.length; i++) {
        var kv = set[i].split('=');
        options[kv[0]] = kv[1].replace(/\'|\"/g, '').trim()
    }
    return options
};
Shortcode.prototype.escapeTagRegExp = function (regex) {
    return regex.replace(/[\[\]\/]/g, '\\$&')
};
Shortcode.prototype.template = function (s, d) {
    for (var p in d) {
        s = s.replace(new RegExp('{' + p + '}', 'g'), d[p])
    }
    return s
};
String.prototype.trim = String.prototype.trim || function () {
    return this.replace(/^\s+|\s+$/g, '')
};
if (window.jQuery) {
    var pluginName = 'shortcode';
    $.fn[pluginName] = function (tags) {
        this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Shortcode(this, tags))
            }
        });
        return this
    }
}


! function (a) {
    a.fn.magtab = function (b) {
        b = jQuery.extend({
            onHover: false,
            animated: true,
            transition: 'fadeInUp'
        }, b);
        return this.each(function () {
            var e = a(this),
                c = e.children('[navi-tab]'),
                d = 0,
                n = 'tab-animated',
                k = 'taber-active';
            if (b.onHover == true) {
                var event = 'mouseenter'
            } else {
                var event = 'click'
            }
            e.prepend('<ul class="selec-taber"></ul>');
            c.each(function () {
                if (b.animated == true) {
                    a(this).addClass(n)
                }
                e.find('.selec-taber').append('<li><a href="#">' + a(this).attr('navi-tab') + '</a></li>')
            }).eq(d).addClass(k).addClass('tab-' + b.transition);
            e.find('.selec-taber a').on(event, function () {
                var f = a(this).parent().index();
                a(this).closest('.selec-taber').find('.active').removeClass('active');
                a(this).parent().addClass('active');
                c.removeClass(k).removeClass('tab-' + b.transition).eq(f).addClass(k).addClass('tab-' + b.transition);
                return false
            }).eq(d).parent().addClass('active')
        })
    }
}(jQuery);


function msgError() {
    return '<span class="no-posts"><b>[Add shortcode]</b></span>'
}

function megaTabs(a, e, t) {
    if ("mtabs" == e)
        if (null != t) {
            for (var s = t.length, n = '<ul class="complex-tabs">', i = 0; i < s; i++) {
                var r = t[i];
                r && (n += '<div class="mega-tab" navi-tab="' + r + '"/>')
            }
            n += "</ul>", a.addClass("has-sub mega-menu mega-tabs").append(n), a.find("a:first").attr("href", "#"), $(".mega-tab").each(function () {
                var a = $(this),
                    e = a.attr("navi-tab");
                ajaxMega(a, "megatabs", 4, e, "getmega")
            }), a.find("ul.complex-tabs").magtab()
        } else a.addClass("has-sub mega-menu mega-tabs").append('<ul class="mega-widget">' + msgError() + "</ul>")
}

function getFeedUrl(a, e, t) {
    var s = "";
    switch (t) {
    case "recent":
        s = "/feeds/posts/default?alt=json-in-script&max-results=" + e;
        break;
    case "random":
        s = "/feeds/posts/default?max-results=" + e + "&start-index=" + Math.floor(Math.random() * e + 1) + "&alt=json-in-script";
        break;
    default:
        s = "/feeds/posts/default/-/" + t + "?alt=json-in-script&max-results=" + e
    }
    return s
}

function getPostLink(a, e) {
    for (var t = 0; t < a[e].link.length; t++)
        if ("alternate" == a[e].link[t].rel) {
            var s = a[e].link[t].href;
            break
        } return s
}

function post_title(a, e, t) {
    return '<a href="' + t + '">' + a[e].title.$t + "</a>"
}

function postThumb(a, e) {
    var t = $("<div>").html(a).find("img:first").attr("src"),
        s = t.lastIndexOf("/") || 0,
        n = t.lastIndexOf("/", s - 1) || 0,
        a = t.substring(0, n),
        n = t.substring(n, s),
        s = t.substring(s);
    return (n.match(/\/s[0-9]+/g) || n.match(/\/w[0-9]+/g) || "/d" == n) && (n = "/w180-h180-p-k-no-nu"), a + n + s
}

function FeatImage(a, e, t) {
    var s = a[e].content.$t,
        e = a[e].media$thumbnail ? a[e].media$thumbnail.url : noThumbnail;
    return '<img class="post-thumb" alt="" src="' + (-1 < s.indexOf(s.match(/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g)) ? !(-1 < s.indexOf("<img")) || s.indexOf(s.match(/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g)) < s.indexOf("<img") ? e.replace("/default.", "/0.") : postThumb(s) : -1 < s.indexOf("<img") ? postThumb(s) : noThumbnail) + '"/>'
}

function post_info(a, e) {
    var t, s, n, a = a[e].content.$t,
        o = $("<div>").html(a),
        i = o.find('strike:contains("price/")'),
        r = o.find('strike:contains("off/")'),
        l = o.find('strike:contains("stock/")');
    return 0 < i.length && (t = i.text().split("/")[1]), 0 < r.length && (s = r.text().split("/")[1]), 0 < l.length && (n = l.text().split("/")[1]), [t ? '<span class="perga">' + SimpleCart.toCurrency(parseFloat(t.trim())) + "</span>" : "", s ? '<span class="prodct_discount show">' + s.trim() + "</span>" : "", n ? '<div class="stock-status show"><span class="out-of-stock-label">' + n.trim() + "</span></div>" : ""]
}

function getAjax(o, m, a, e) {
    switch (m) {
    case "megatabs":
    case "slidetabs":
        null == e && (e = "geterror");
        var t = getFeedUrl(m, a, e);
        $.ajax({
            url: t,
            type: "GET",
            cache: !0,
            dataType: "jsonp",
            success: function (a) {
                var e = "";
                "megatabs" === m && (e = '<ul class="mega-widget">');
                a = a.feed.entry;
                if (null != a)
                    for (var t = 0, s = a; t < s.length; t++) {
                        var n = getPostLink(s, t);
                        if (n === window.location.href) continue;
                        var i = post_title(s, t, n),
                            r = FeatImage(s, t, n),
                            l = post_info(s, t),
                            u = "";
                        "megatabs" === m && (u += '<div class="mega-item"><div class="mega-content"><div class="post-image-wrap"><a class="post-image-link" href="' + n + '">' + r + "</a>" + l[1] + l[2] + '</div><h2 class="post-title">' + i + '</h2><div class="mega-t">' + l[0] + "</div></div></div>"), e += u
                    } else e = "megatabs" === m ? '<ul class="mega-widget">' + msgError() + "</ul>" : msgError();
                e += "</ul>", o.html(e)
            }
        })
    }
}

function ajaxMega(a, e, t, s, n) {
    if (n.match("getmega")) {
        if ("megatabs" == e) return getAjax(a, e, t, s);
        a.addClass("has-sub mega-menu")
    }
}

function post_link(a, e) {
    for (var t = 0; t < a[e].link.length; t++)
        if ("alternate" == a[e].link[t].rel) {
            var s = a[e].link[t].href;
            break
        } return s
}
$("#Hmain-menu").each(function () {
    for (var a = $(this).find(".LinkList ul > li").children("a"), e = a.length, t = 0; t < e; t++) {
        var s, n = a.eq(t),
            i = n.text();
        "_" !== i.charAt(0) && "_" === a.eq(t + 1).text().charAt(0) && (s = n.parent()).append('<ul class="sub-menu m-sub"/>'), "_" === i.charAt(0) && (n.text(i.replace("_", "")), n.parent().appendTo(s.children(".sub-menu")))
    }
    for (t = 0; t < e; t++) {
        var r, l = a.eq(t),
            u = l.text();
        "_" !== u.charAt(0) && "_" === a.eq(t + 1).text().charAt(0) && (r = l.parent()).append('<ul class="sub-menu2 m-sub"/>'), "_" === u.charAt(0) && (l.text(u.replace("_", "")), l.parent().appendTo(r.children(".sub-menu2")))
    }
    $("#Hmain-menu ul li ul").parent("li").addClass("has-sub"), $("#Hmain-menu .widget").addClass("show-menu")
}), $("#Hmain-menu-nav").clone().appendTo(".tmobil-menu"), $(".tmobil-menu .has-sub").append('<div class="submenu-toggle"/>'), $(".tmobil-menu ul > li a").each(function () {
    var a = $(this),
        e = a.attr("href").trim(),
        t = e.toLowerCase(),
        e = e.split("/")[0];
    t.match("mega-menu") && a.attr("href", "/search/label/" + e + "?&max-results=" + postPerPage)
}), $(".tmobil-menu ul li a").each(function () {
    var r = $(this),
        a = r.attr("href");
    $(this).data("title");
    a.toLowerCase().match("getmega") && (r.parent("li").append('<div class="getMega">' + a + "</div>"), r.parent("li").find(".getMega").shortcode({
        getMega: function () {
            var a = this.options.label;
            switch (this.options.type) {
            case "mtabs":
                if (r.parent("li").addClass("has-sub").append('<div class="submenu-toggle"/>'), r.attr("href", "#"), null != a) {
                    for (var e = (a = a.split("/")).length, t = '<ul class="sub-menu m-sub">', s = 0; s < e; s++) {
                        var n = a[s],
                            i = postPerPage;
                        n && (t += '<li><a href="/search/label/' + n + "?&max-results=" + i + '">' + n + "</a></li>")
                    }
                    t += "</ul>", r.parent("li").append(t);
                    break
                }
            }
        }
    }))
}), $(".tmobil-menu ul li .submenu-toggle").on("click", function (a) {
    $(this).parent().hasClass("has-sub") && (a.preventDefault(), ($(this).parent().hasClass("show") ? $(this).parent().removeClass("show").find("> .m-sub") : $(this).parent().addClass("show").children(".m-sub")).slideToggle(170))
}), $("#Hmain-menu li,#car-menu li").each(function () {
    var a = $(this),
        e = a.find("a").attr("href"),
        t = e.toLowerCase(),
        s = a,
        n = s,
        i = t;
    t.match("getmega") && s.append('<div class="getMega">' + e + "</div>"), s.find(".getMega").shortcode({
        getMega: function () {
            var a = this.options.results,
                e = this.options.label,
                t = this.options.type;
            ajaxMega(s, t, a, e, i), "mtabs" == t && (null != e && (e = e.split("/")), megaTabs(n, t, e))
        }
    })
});

jQuery(document).ready(function (e) {
        function n() {
            var n = !e(".azion-drop").hasClass("dropdown-active");
            e(".azion-drop").toggleClass("dropdown-active", n), e(".azonshop-brig").toggleClass("dropdown-active", n), n || e(".azion-drop").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {
                e(".has-children ul").addClass("is-hidden"), e(".move-out").removeClass("move-out"), e(".is-active").removeClass("is-active")
            })
        }
        e(".azonshop-brig").on("click", function (e) {
            e.preventDefault(), n()
        }), e(".azion-drop .cd-close").on("click", function (e) {
            e.preventDefault(), n()
        }), e(".has-children").children("a").on("click", function (n) {
            n.preventDefault(), e(this).next("ul").removeClass("is-hidden").end().parent(".has-children").parent("ul").addClass("move-out")
        }), e(".go-back").on("click", function () {
            e(this).parent("ul").addClass("is-hidden").parent(".has-children").parent("ul").removeClass("move-out")
        });
        var t = e(".azonshop-menu").hasClass("open-to-left") ? "left" : "right";
        e(".meem-dropdown").menuAim({
            activate: function (n) {
                e(n).children().addClass("is-active").removeClass("fade-out"), 0 === e(".meem-dropdown .fade-in").length && e(n).children("ul").addClass("fade-in")
            },
            deactivate: function (n) {
                e(n).children().removeClass("is-active"), (0 === e("li.has-children:hover").length || e("li.has-children:hover").is(e(n))) && (e(".meem-dropdown").find(".fade-in").removeClass("fade-in"), e(n).children("ul").addClass("fade-out"))
            },
            exitMenu: function () {
                return e(".meem-dropdown").find(".is-active").removeClass("is-active"), !0
            },
            submenuDirection: t
        })
    }),
    function (e) {
        e.fn.menuAim = function (e) {
            return this.each(function () {
                n.call(this, e)
            }), this
        };

        function n(n) {
            var t = e(this),
                i = null,
                o = [],
                a = null,
                s = null,
                r = e.extend({
                    rowSelector: "> li",
                    submenuSelector: "*",
                    submenuDirection: "right",
                    tolerance: 75,
                    enter: e.noop,
                    exit: e.noop,
                    activate: e.noop,
                    deactivate: e.noop,
                    exitMenu: e.noop
                }, n),
                l = function (e) {
                    o.push({
                        x: e.pageX,
                        y: e.pageY
                    }), o.length > 3 && o.shift()
                },
                u = function () {
                    s && clearTimeout(s), r.exitMenu(this) && (i && r.deactivate(i), i = null)
                },
                c = function () {
                    s && clearTimeout(s), r.enter(this), v(this)
                },
                d = function () {
                    r.exit(this)
                },
                h = function () {
                    f(this)
                },
                f = function (e) {
                    e != i && (i && r.deactivate(i), r.activate(e), i = e)
                },
                v = function (e) {
                    var n = m();
                    n ? s = setTimeout(function () {
                        v(e)
                    }, n) : f(e)
                },
                m = function () {
                    if (!i || !e(i).is(r.submenuSelector)) return 0;
                    var n, s, l = t.offset(),
                        u = {
                            x: l.left,
                            y: l.top - r.tolerance
                        },
                        c = {
                            x: l.left + t.outerWidth(),
                            y: u.y
                        },
                        d = {
                            x: l.left,
                            y: l.top + t.outerHeight() + r.tolerance
                        },
                        h = {
                            x: l.left + t.outerWidth(),
                            y: d.y
                        },
                        f = o[o.length - 1],
                        v = o[0];
                    if (!f || (v || (v = f), v.x < l.left || v.x > h.x || v.y < l.top || v.y > h.y || a && f.x == a.x && f.y == a.y)) return 0;

                    function m(e, n) {
                        return (n.y - e.y) / (n.x - e.x)
                    }
                    "right" == r.submenuDirection ? (n = c, s = h) : "left" == r.submenuDirection ? (n = u, s = d) : "below" == r.submenuDirection ? (n = d, s = h) : "above" == r.submenuDirection && (n = u, s = c);
                    var p = m(f, n),
                        x = m(f, s),
                        C = m(v, n),
                        g = m(v, s);
                    return p < C && x > g ? (a = f, 0) : (a = null, 0)
                };
            t.mouseleave(u).find(r.rowSelector).mouseenter(c).mouseleave(d).click(h), e(document).mousemove(l)
        }
    }(jQuery);

$(function () {
    $('#recent-prodct1 .widget .title').contents().appendTo('.recen-tab .tabs .tab1');
    $('#recent-prodct2 .widget .title').contents().appendTo('.recen-tab .tabs .tab2');
    $('#recent-prodct3 .widget .title').contents().appendTo('.recen-tab .tabs .tab3');
    $('#recent-prodct4 .widget .title').contents().appendTo('.recen-tab .tabs .tab4');
});





document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.querySelector('.ijjiIf-container');
    const searchRslt = document.querySelector('.search-section');

    const navbar = document.querySelector('#ijjiIf');
    const header = document.querySelector('.search-box55');

    if (!searchBar || !navbar || !header) {
        console.warn("Search bar, navbar, or header not found in DOM.");
        return;
    }

    function moveSearchBar() {
        if (window.innerWidth <= 896) {
            if (!navbar.contains(searchBar)) {
                navbar.append(searchBar);
                navbar.appendChild(searchRslt);
                searchBar.classList.remove('hidden');
                searchRslt.classList.add('in-navbar');
                searchRslt.classList.remove('in-header');
            }
        } else {
            searchBar.classList.remove('hidden');
            if (!header.contains(searchBar)) {
                header.appendChild(searchBar);
                header.appendChild(searchRslt);
                searchRslt.classList.add('in-header');
                searchRslt.classList.remove('in-navbar');
            }
        }
    }
    moveSearchBar();
    window.addEventListener('resize', moveSearchBar);
});



$('.zeixilo, .mySearch').on('click', function () {

    $('#ijjiIf').fadeIn(200)
    $('body').addClass('zeiavilo')
    setTimeout(() => $('#search-input5').focus(), 50);
})

$('.overlay, #overlay-id').on('click', function () {
    $('body').removeClass('zeiavilo zsililo')
});



(function ($) {
    var currentKeyword = '';
    var currentIndex = 1;
    var maxResults = 50; // fetch 50 posts per chunk
    var loading = false;
    var matchedResults = [];
    var endOfFeed = false;

    function runSearchTrigger() {
        var keyword = $('#search-input5').val().trim();
        if (keyword === '' || keyword.length < 2) return;

        if (keyword === localStorage.getItem('search_id')) {
            console.log('Duplicate search ignored.');
            return;
        }

        localStorage.setItem('search_id', keyword);
        currentKeyword = keyword;
        currentIndex = 1;
        endOfFeed = false;
        matchedResults = [];
        $('.search-section').removeClass('hidden');
        $('.search-section').html('<div class="loading-icon">Loading...</div>');
        $('.load-more-container').hide();
        fetchAndFilterPosts(true);
    }

    $('.load-more-btn').on('click', function () {
        if (!loading && !endOfFeed) {
            fetchAndFilterPosts(false);
        }
    });

    function fetchAndFilterPosts(isNewSearch) {
        loading = true;
        var url = '/feeds/posts/default?alt=json&start-index=' + currentIndex + '&max-results=' + maxResults;

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                var entries = data.feed.entry || [];
                if (entries.length === 0) {
                    endOfFeed = true;
                    if (isNewSearch && matchedResults.length === 0) {
                        $('.search-section').html('<p>No results found.</p>');
                    }
                    $('.load-more-container').hide();
                    loading = false;
                    return;
                }

                var keywords = currentKeyword.toLowerCase().split(/\s+/);
                var newMatches = entries.filter(function (entry) {
                    var title = entry.title.$t.toLowerCase();
                    var content = (entry.summary ? entry.summary.$t : '').toLowerCase();
                    return keywords.some(function (word) {
                        return title.includes(word) || content.includes(word);
                    });
                });

                matchedResults = matchedResults.concat(newMatches);

                renderResults(newMatches, isNewSearch);

                currentIndex += maxResults;
                loading = false;

                if (!endOfFeed) {
                    $('.load-more-container').show();
                }
            },
            error: function () {
                loading = false;
                if (isNewSearch) {
                    $('.search-section').html('<p>Error loading posts.</p>');
                }
                $('.load-more-container').hide();
            }
        });
    }

    function highlightText(text, keywords) {
        keywords.forEach(function (word) {
            var re = new RegExp('(' + word + ')', 'gi');
            text = text.replace(re, '<mark>$1</mark>');
        });
        return text;
    }

    function renderResults(entries, isNewSearch) {
        if (entries.length === 0 && isNewSearch) {
            $('.search-section').html('<p>No matching results.</p>');
            return;
        }

        var keywords = currentKeyword.toLowerCase().split(/\s+/);
        var html = '';

        entries.forEach(function (entry) {
            var rawTitle = entry.title.$t;
            var rawContent = (entry.summary ? entry.summary.$t : '');
            var title = rawTitle.toLowerCase();
            var content = rawContent.toLowerCase();

            var matched = keywords.some(function (word) {
                return title.includes(word) || content.includes(word);
            });

            if (!matched) return;

            var highlightedTitle = highlightText(rawTitle, keywords);
            var highlightedSnippet = highlightText(rawContent, keywords);

            var missingWords = keywords.filter(function (word) {
                return !(title.includes(word) || content.includes(word));
            });

            var link = entry.link.find(l => l.rel === 'alternate').href;
            var published = entry.published.$t.split('T')[0];
            var thumb = entry.media$thumbnail ?
                entry.media$thumbnail.url.replace('/s72-c/', '/w400-h300-c/') :
                'https://via.placeholder.com/400x300?text=No+Image';

            html += `
      <div class="ibniIf">
        <div class="llhtsihi">
          <a class="post-filter-link" href="${link}">
            <img class="snip-thumbnail" alt="${highlightedTitle}" src="${thumb}" loading="lazy"/>
          </a>
        </div>
        <div class="entery-category-box">
          <h2 class="entry-title"><a href="${link}">${highlightedTitle}</a></h2>
          <div class="post-snip">
            <span class="date" datetime="${published}">${published}</span>
            <p class="snippet">${highlightedSnippet}</p>
            ${missingWords.length > 0 ? `<div class="missing">Missing: <s>${missingWords.join(', ')}</s></div>` : ''}
          </div>
        </div>
      </div>
    `;
        });

        if (isNewSearch) {
            $('.search-section').html('<div class="arRlLii">' + html + '</div>');
        } else {
            $('.search-section .arRlLii').append(html);
        }

        if (isNewSearch) {
            $('.search-section').append(`
      <div class="link-snip">
        <a href="/search?q=${encodeURIComponent(currentKeyword)}">
          ${typeof tMessages !== 'undefined' ? tMessages.showMore : 'Show More'}
        </a>
      </div>
    `);
        }
    }

    $('.ijjiIf-close').on('click', function (e) {
        e.preventDefault();
        runSearchTrigger();
    });

    $('#search-input5').on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            runSearchTrigger();
        }
    });

})(jQuery);










var lastScrollTop = 0;
var delta5 = 5; // Minimum scroll difference to detect
var navbar = $('.header');
var navbarC = $('.headCn');
var navbarHeight = navbarC.outerHeight();
var hideAfter = 400;

$(window).on('scroll', function () {
    var st = $(this).scrollTop();

    if (st > navbarHeight) {
        navbar.addClass('flyi');
    } else {
        navbar.removeClass('flyi');
        navbar.removeClass('fmb'); // remove fmb when near top
    }

    if (window.innerWidth <= 896) {

        if (Math.abs(lastScrollTop - st) <= delta5)
            return;

        if (st > lastScrollTop && st > hideAfter) {

            navbar.removeClass('show');
        } else {

            navbar.addClass('show');

            if (st > navbarHeight) {
                navbar.addClass('fmb');
            }
        }

    } else {

        navbar.addClass('show');
        navbar.removeClass('fmb');
    }

    lastScrollTop = st;
});