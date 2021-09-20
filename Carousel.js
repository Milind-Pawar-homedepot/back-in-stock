const MAX_VIEW_PRODUCT_PIP_CAROUSEL = 16;

    const readCookie = function (e) {
        e = encodeURIComponent(e);
        let t = (";" + document.cookie).split(" ").join(";"),
            n = t.indexOf(";" + e + "="),
            i = n < 0 ? n : t.indexOf(";", n + 1);
        return n < 0 ? "" : decodeURIComponent(t.substring(n + 2 + e.length, i < 0 ? t.length : i))
    };

    const readAndDecodeBase64Cookie = function (cookieName, separator = ".") {
        try {
            let encodedCookieValue = readCookie(cookieName);
            let encodedSubstring = encodedCookieValue.split(separator)[0];
            let regexPattern = /"/g;
            let cleanedEncodedSubstring = encodedSubstring.replace(regexPattern, '');
            let decodedCookieValue = atob(cleanedEncodedSubstring);
            let cookieObject = (typeof decodedCookieValue === "string" && decodedCookieValue ? JSON.parse(decodedCookieValue) : {});
            return cookieObject;
        }
        catch (error) {
            return {};
        }
    };

    const getUserStatus = function () {
        let b2b = readCookie('THD_CUSTOMER');
        let b2c = readCookie('THD_USER');
        let userStatus = '';

        if (b2c != "") {
            let temp = readAndDecodeBase64Cookie("THD_USER", ".");
            if (temp.svocCustomerAccountId != '')
                userStatus = 'b2cAuth';
        }
        if (b2b != "") {
            let temp = readAndDecodeBase64Cookie("THD_CUSTOMER", ".");
            if (temp.c == "B2X" && temp.t != '')
                userStatus = 'b2xAuth';
            if (temp.c == "B2B" && temp.t != '')
                userStatus = 'b2bAuth';
        }
        if (b2b == "" && b2c == "") {
            userStatus = "guest";
        }
        return userStatus;

    }
 const getPriceBreakdown = (price) => {
        if (typeof price === "number") {
            let dollar = price | 0;
            let currency = !dollar ? "¢" : "$";
            let cent = (price % 1).toFixed(2).match(/\d{2}$/g)[0];
            return { currency, dollar, cent };
        }
        return null;
    };

 function carousel_creator() {
           
            const userStatus = getUserStatus();
            const apiLink = 'https://datascience-testservice-api.hd-datascience-prod.gcp.homedepot.com/dts/v1/product?anchor=051CC9D043AB935D0S&model=back_in_stock_alert&appid=desktop&key=AnPrMR0LKfdglJQfoHqsT4sAhDLHNaGw'
            if (userStatus == "b2cAuth") {
                fetch(apiLink)
                    .then(resp => resp.json())
                    .then(resp => {  console.log(resp['products'])
                        if (resp['products']) {
                            setTimeout(function () {
                                createProductSlider(resp['products']);
                            }, 2000);
                        }
                    });
            }
        


    }


    function createProductSlider(data) {
        var productsHTML = {};
        var cnt = 0;
        for (let key in data) {
          //  console.log(key, data);
            if (cnt == MAX_VIEW_PRODUCT_PIP_CAROUSEL) { continue; }
            if (data.hasOwnProperty(key)) {
                var prd = data[key]; 
                //if(typeof prd['brand'] !== 'undefined' && typeof prd['imageURL'] !== 'undefined' && typeof prd['price'] !== 'undefined' && typeof prd['canonicalURL'] !== 'undefined') {
                if (typeof prd['imageURL'] !== 'undefined') {
                   
                        productsHTML[key] = getProductPodHtmlNucleus(prd); console.log("here")
                     
                    if (productsHTML[key] != '' && typeof productsHTML[key] !== 'undefined') {
                        cnt++;
                    } else if (typeof productsHTML[key] !== 'undefined') {
                        delete productsHTML[key];
                    }
                }
            }
        }
  
        if (productsHTML != {} && cnt >= 4) {
            pipAlternateCarousel(productsHTML);
        }  console.log("all done");
    }

    function getProductPodHtmlNucleus(pdata) {
        try {
            let priceParams = getPriceBreakdown(parseFloat(pdata['price']));
            let imageURL = pdata['imageURL'];
            if (imageURL.includes('<SIZE>')) {
                imageURL = imageURL.replace("<SIZE>", "400");
            }
            let addToCartLink = "javascript.open('/mycart/overlay#/add-to-cart/'" + pdata['id'] + "'/1/ShipToHome/DirectShip/web')";
            if (typeof pdata['productName'] === 'undefined') {
                pdata['productName'] = '';
            }
            if (typeof pdata['brand'] === 'undefined') {
                pdata['brand'] = '';
            }
            if (typeof pdata['canonicalURL'] === 'undefined') {
                pdata['canonicalURL'] = '';
            }
            if (typeof pdata['rating'] === 'undefined') {
                pdata['rating'] = 0;
            }
            if (typeof pdata['reviews'] === 'undefined') {
                pdata['reviews'] = '';
            }
            if (typeof priceParams['currency'] === 'undefined') {
                priceParams['currency'] = '';
            }
            if (typeof priceParams['dollar'] === 'undefined') {
                priceParams['dollar'] = '';
            }
            if (typeof priceParams['cent'] === 'undefined') {
                priceParams['cent'] = '';
            }

            html = '<div class="certona__productpod " data-type="product"><meta data-prop="productID" content="' + pdata['id'] + '"><meta data-prop="name" content="' + pdata['productName'] + '"><meta data-prop="brand" content="' + pdata['brand'] + '"><div class="certona__productimagewrapper"> <a href="' + pdata['canonicalURL'] + '" data-product-id="' + pdata['id'] + '" data-schema="pip_alternatives" data-strategy="co-view-2w-bots-filtered" data-version="v1"> <img class="certona__productimg" src="' + imageURL + '" alt="' + pdata['productName'] + '" loading="lazy" width="170" height="170"> </a></div><div class="certona__productdescriptionwrapper"> <a class="" href="' + pdata['canonicalURL'] + '" data-product-id="' + pdata['id'] + '" data-schema="pip_alternatives" data-strategy="co-view-2w-bots-filtered" data-version="v1"> <span class="certona__brand">' + pdata['brand'] + '</span> <span>' + pdata['productName'] + '</span> </a></div><div class="certona__productratingwrapper"> <a class="reviews " href="' + pdata['canonicalURL'] + '" data-product-id="' + pdata['id'] + '" data-schema="pip_alternatives" data-strategy="co-view-2w-bots-filtered" data-version="v1"> <span class="stars" rel="' + pdata['rating'] + '" title="Rating ' + pdata['rating'] + ' out of 5" style="width:' + (pdata['rating'] * 20) + '%"></span> </a> <a href="' + pdata['canonicalURL'] + '#product-reviews" data-schema="pip_alternatives" data-strategy="co-view-2w-bots-filtered" data-version="v1">(' + pdata['reviews'] + ')</a></div><div class="certona__productpricingwrapper"> <span class="u__normal u__text--alternate u--hide"> See Lower Price in Cart </span><div class="price "> <span class="price__format">' + priceParams['currency'] + '</span>' + priceParams['dollar'] + '<span class="price__format">' + priceParams['cent'] + '</span></div></div><div class="certona__productbttnwrapper"> <a class="js-certona-atc bttn-outline bttn-outline--primary" data-onclickbeacon="" href="' + addToCartLink + '" data-quantity="1" data-item-id="' + pdata['id'] + '" data-schema="pip_alternatives" data-strategy="co-view-2w-bots-filtered" data-version="v1"> <span class="bttn__content">Add To Cart</span> </a></div></div>';
             
            return html;
        } catch (e) { return ''; }
    }

    const pipAlternateCarousel = function (customData) {
        console.log("milind ",customData)
        var replaceCarouselWith;
       
            var carousel_id = 'pip_alternatives';
            if (document.querySelector("#TodaysRecommendationsForYou > div > div.content-card__summary > div") != null) {
                carousel_id = 'Pip_Alternatives_Non_HDhome';
            }
            replaceCarouselWith = $("#TodaysRecommendationsForYou > div > div.content-card__summary > div")

            const container = document.createElement('div');
            container.id = 'pipAlternativeCarouselId';
            container.classList.add('dpd__carousel--wrapper');
            container.innerHTML = '<div class="owl-carousel">';

            replaceCarouselWith.empty();console.log('element is removed')
            replaceCarouselWith.html(container);
            initializepipAlternativeCarosuel.call(container, customData);
        
    }

    const anchorPattern = /\/\d+$/g, negativeIntegerPattern = /-\d+/g, translate3dPattern = /translate3d\(-?\d+px, -?\d+px, -?\d+px\)/g;
    const initializepipAlternativeCarosuel = function (customData) {
        var carousel = this;
        var nav = Object.keys(customData).length <= 4 ? false : true;
        var navText = false;
        var navClass = false;
        if (nav) {
            navText = [
                '<svg class="carousel__prev-button" viewBox="0 0 12 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><path d="M3.35738643,4.0642103 L3.35738643,3.09586423 L17.8582152,3.09586423 L17.8582152,5.03255637 L5.28304981,5.03255637 L5.28304981,17.6355953 L3.35738643,17.6355953 L3.35738643,4.0642103 Z" id="back-arrow" fill="#F96302" sketch:type="MSShapeGroup" transform="translate(10.607801, 10.365730) rotate(-45.000000) translate(-10.607801, -10.365730) "></path></g></svg>',
                '<svg class="carousel__next-button" viewBox="0 0 12 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><path d="M-5.88468462,4.30628135 L-5.88468462,3.33793528 L8.61614419,3.33793528 L8.61614419,5.27462742 L-3.95902124,5.27462742 L-3.95902124,17.8776664 L-5.88468462,17.8776664 L-5.88468462,4.30628135 Z" id="next-arrow" fill="#F96302" sketch:type="MSShapeGroup" transform="translate(1.365730, 10.607801) rotate(-225.000000) translate(-1.365730, -10.607801) "></path></g></svg>'
            ];
            navClass = ['carousel__prev', 'carousel__next'];
        }
        console.log('working 1')
        carousel = $(carousel).find('.owl-carousel'); console.log(carousel)
        carousel.owlCarousel({
            autoWidth: true,         
            width: $("#pipAlternativeCarouselId").width(),
            dots: false,
            items: 6,
            margin: 10,
            nav: nav,
            navClass: navClass,
            navText: navText,
            onInitialized: function (_e) {
                var productsHTML = '';
                for (let key in customData) {
                    if (customData.hasOwnProperty(key)) {
                        var prdpod = customData[key];
                        productsHTML += '<div class="item">' + prdpod + '</div>';
                    }
                }
                setTimeout(() => {
                    carousel.trigger('replace.owl.carousel', productsHTML).trigger('refresh.owl.carousel')
                }, 1000)
            },
            onTranslated: function () { // called after carousel has sliden
                if (carousel.find('.owl-nav .carousel__next.disabled').length) {
                    if (negativeIntegerPattern.test(this.$stage.css('transform'))) {
                        const currentX = parseFloat(this.$stage.css('transform').match(negativeIntegerPattern)[0])
                        if (translate3dPattern.test(this.$stage.attr('style'))) {
                            let adjustedTransform = $(this.$stage).parent().get(0).getClientRects()[0].right - $(this.$stage).get(0).getClientRects()[0].right
                            adjustedTransform = currentX + adjustedTransform
                            $(this.$stage).attr('style', 'transform: ' + $(this.$stage).attr('style')
                                .match(translate3dPattern)[0]
                                .replace(negativeIntegerPattern, adjustedTransform)
                                .concat(';transition: all 0.35s ease 0s;width: max-content;')
                            )
                        }
                    }
                }
            },
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 3
                },
                1000: {
                    items: 6
                }
            },
            slideBy: 3
        })
    }
