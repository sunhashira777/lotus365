import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Navigation, Autoplay } from 'swiper/modules';
import { getImage } from '@/utils/imagekit';
import { useGetBannersQuery } from '@/api/contentApi';
import { useBannerPlatform } from '@/hooks/useBannerPlatform';

const imagesArr = [
  {
    id: 1,
    img: '/images/newSlider1/1.jpg',
    // css: 'h-[100px] max-w-[200px]',
  },
  {
    id: 2,
    img: '/images/newSlider1/2.jpg',
    // css: 'h-[200px] max-w-[200px]',
  },
  {
    id: 3,
    img: '/images/newSlider1/3.jpg',
    // css: 'h-[100px] max-w-[200px]',
  },
  {
    id: 4,
    img: '/images/newSlider1/4.jpg',
    // css: 'h-[100px] max-w-[200px]',
  },
  {
    id: 5,
    img: '/images/newSlider1/5.jpg',
    // css: 'h-[100px] max-w-[200px]',
  },
  {
    id: 6,
    img: '/images/newSlider1/66.jpg',
    // css: 'h-[100px] max-w-[200px]',
  },
  {
    id: 7,
    img: '/images/newSlider1/6.jpg',
    // css: 'h-[100px] max-w-[200px]',
  },
  {
    id: 8,
    img: '/images/newSlider1/6.jpg',
    // css: 'h-[100px] max-w-[200px]',
  },
  {
    id: 9,
    img: '/images/newSlider1/6.jpg',
    // css: 'h-[100px] max-w-[200px]',
  },
];

const HomeTopSLider = () => {
  const { platform } = useBannerPlatform();
  const { data, isLoading } = useGetBannersQuery({
    platform,
    type: 'HomeBanner',
  });
  const banners = data?.data?.[platform]?.HomeBanner ?? [];
  console.log('banners', banners);
  const MIN_SLIDES = 3;

  const getBannerList = (apiBanners, fallbackBanners) => {
    let finalBanners = [...(apiBanners || [])];

    if (finalBanners.length === 0) {
      return fallbackBanners;
    }
    let i = 0;
    while (finalBanners.length < MIN_SLIDES) {
      finalBanners.push(fallbackBanners[i % fallbackBanners.length]);
      i++;
    }

    return finalBanners;
  };

  const bannerList = getBannerList(banners, imagesArr);
  return (
    <div className="my-2 relative w-full ">
      <Swiper
        pagination={true}
        loop={true}
        slidesPerView={3}
        spaceBetween={0}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          10: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          550: {
            slidesPerView: 2,
            spaceBetween: 0,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 0,
          },
        }}
        modules={[Autoplay, Navigation]}
        navigation={{
          nextEl: '.slider11',
          prevEl: '.slider22',
        }}
        className="mySwiper w-full"
      >
        {bannerList?.map((item, index) => (
          <SwiperSlide
            key={index}
            className=" h-[200px] flex items-center justify-center"
          >
            <img
              src={getImage(item?.img)}
              alt=""
              className={`rounded-md w-full ${item?.css}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeTopSLider;
