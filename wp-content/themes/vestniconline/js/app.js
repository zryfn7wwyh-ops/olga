var app = new Vue({
    el: '#app',
    components: {

    },
    methods: {
		openGallerySlider(imagesString){
			const imagesArray = imagesString.split(";");
			this.arrayImagesModal = imagesArray;
			this.options.modals.imageModal.visible = true;
			docModalSwiper = new Swiper('.docModalSwiper', {
				// Настройки слайдера
			   loop: true,
				slidesPerView: 1, // Один элемент в слайдере
				spaceBetween: 30,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
			});

		},
        closeCurrentModal() {
            for (let modal in this.options.modals) {
                if (this.options.modals[modal].visible) {
                    this.options.modals[modal].visible = false;
                    break;
                }
            }
        },
        checkClose(event) {
            const modalOverlay = event.target.closest('.fComponent-modal.overlay');
            const modalContent = modalOverlay.querySelector('.content');

            if (event.target === modalOverlay && !modalContent.contains(event.target)) {
                this.closeCurrentModal()
            }
        },
        toggleModal(modalKey, state = true) {
            for (let modal in this.options.modals) {
                if (modal !== modalKey) {
                    this.options.modals[modal].visible = false;
                }
            }
            this.options.modals[modalKey].visible = state;
        },
        openImageModal(event) {
            let image = event.target.src;
            this.options.modals.imageModal.visible = true;
            const text = event.target.closest('.row').querySelector('.fw-bold').textContent;
            this.options.modals.imageModal.title = text;
            let imgTag = document.getElementById('imgInModal');
            imgTag.src = image;
        },
    },
	mounted() {
        document.addEventListener( 'wpcf7submit', function( event ) {
            ym(82948618,'reachGoal','order_done')
        }, false );

        setTimeout(() => {
            this.toggleModal('tenModal');
        }, 30000);
	},
    data: {
		arrayImagesModal: [],
        isDev: false,
        test: 'Test',
		openMobileMenu: false,
        isMobileMenu: false,
		 options:{
			blurBackground: false,
			modals: {
				generationForm: {
					visible: false,
					title: ''
				},
				blagoPopup:{
					visible: false,
					title: ''
				},
				exitPopup:{
					visible: false,
					title: ''
				},
				exitPopup_2:{
					visible: false,
					title: '',
					formVisible: false,
				},
				writerPopup:{
					visible: false,
					title: ''
				},
				callModal: {
					visible: false,
					title: ''
				},
				payment_1: {
					visible: false,
					title: ''
				},
				payment_2: {
					visible: false,
					title: ''
				},
				payment_3: {
					visible: false,
					title: ''
				},
				mapModal: {
					visible: false,
				},
				publication: {
					visible: false,
					title: '',
				},
				formModal: {
					visible: false,
				},
				consultingModal: {
					visible: false,
					title: ''
				},
				imageModal: {
					visible: false,
					title: '',
					img_source: ''
				},
				messagePublicationModal: {
					visible: false,
					title: ''
				},
                // НОВОЕ МОДАЛЬНОЕ ОКНО
                licvidationsModal: {
                    visible: false,
                    title: ''
                },
                // НОВОЕ МОДАЛЬНОЕ ОКНО
                licvidModal: {
                    visible: false,
                    title: ''
                },
                // НОВОЕ МОДАЛЬНОЕ ОКНО
                tenModal: {
                    visible: false,
                    title: ''
                }
			},
		 }
    }
})
const blagoiotziv = new Swiper('.blagoiotziv', {
    slidesPerView: 1,
    spaceBetween: 30,
	autoplay: {
    delay: 3000,
  },
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        480: {
            slidesPerView: 1,
            spaceBetween: 0,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 40,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 50,
        },
    },
});
const writeblago = new Swiper('.writeblago', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
	autoplay: {
    delay: 3000,
  },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        480: {
            slidesPerView: 1,
            spaceBetween: 0,
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 40,
        },
        1024: {
            slidesPerView: 4,
            spaceBetween: 50,
        },
    },
});

var docSwiper = new Swiper('.docSwiper', {
    // Настройки слайдера
   loop: true,
    autoHeight: true, // Автоматическая высота
    slidesPerView: 1, // Один элемент в слайдере
    spaceBetween: 30,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

var docModalSwiper = new Swiper('.docModalSwiper', {
    // Настройки слайдера
   loop: true,
    slidesPerView: 1, // Один элемент в слайдере
    spaceBetween: 30,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});


var blagoPopup = new Swiper('.blagoPopup', {
    // Настройки слайдера
   loop: true,
    slidesPerView: 1, // Один элемент в слайдере
    spaceBetween: 30,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

var writerPopup = new Swiper('.writerPopup', {
    // Настройки слайдера
   loop: true,
    slidesPerView: 1, // Один элемент в слайдере
    spaceBetween: 30,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('click', function(event) {
        if (
            event.target.classList.contains('overlay') ||
            event.target.classList.contains('fComponent-modal')
        ) {
            app.closeCurrentModal();
        }
    });
	
	
	
	function setLocalStorageItem(key, value) {
  localStorage.setItem(key, value);
}
})

function getLocalStorageItem(key) {
  return localStorage.getItem(key);
}

function userExit() {
  if (!getLocalStorageItem('userExited')) {
	  if(Math.random()<0.5){
		  app.options.modals.exitPopup.visible = true;
	  }
     else{
		  app.options.modals.exitPopup_2.visible = true;
	 }
	 
    setLocalStorageItem('userExited', true);
  }
}

// document.documentElement.addEventListener('mouseleave', function(event) {
//   event.preventDefault();
//   userExit();
// });
// });
/*    document.addEventListener("DOMContentLoaded", function () {
    function applyPhoneMask() {
        document.querySelectorAll('input[name="your-tel"]').forEach((phoneInput) => {
            if (!phoneInput.dataset.masked) {
                phoneInput.dataset.masked = "true";
                const mask = IMask(phoneInput, {
                    mask: "+{7} (000) 000-00-00",
                });

                function validatePhone() {
                    return phoneInput.value.replace(/\D/g, "").length === 11;
                }

                phoneInput.addEventListener("input", () => {
                    phoneInput.setCustomValidity(validatePhone() ? "" : "Номер телефона должен быть полным.");
                });

                // Валидация перед отправкой формы
                const form = phoneInput.closest('form');
                if (form) {
                    form.addEventListener('submit', function (e) {
                        // Отладка: что вообще в поле
                        console.log("Значение поля:", phoneInput.value);
                        console.log("Только цифры:", phoneInput.value.replace(/\D/g, ""));
                        console.log("Длина цифр:", phoneInput.value.replace(/\D/g, "").length);
                        
                        const digits = phoneInput.value.replace(/\D/g, "");
                        
                        if (digits.length !== 11) {
                            e.preventDefault();
                            alert("Номер телефона должен быть полным.");
                        }
                    });
                }
            }
        });
    }

    // Маска для уже загруженных форм
    applyPhoneMask();

    // Наблюдение за DOM (для динамических форм)
    const observer = new MutationObserver(applyPhoneMask);
    observer.observe(document.body, { childList: true, subtree: true });
});*/

jQuery(document).ready(function(){
  jQuery(".your-tel").inputmask("+7(999)999-99-99");  //static mask
});