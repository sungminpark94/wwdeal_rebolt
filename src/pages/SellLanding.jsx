import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";

const SellLanding = () => {
  const navigate = useNavigate();

  const steps = [
    {
      step: "STEP1",
      title: "차량 정보를 등록해 주세요",
      description: "차량 정보를 입력하면 예상 견적을 바로 확인할 수 있어요"
    },
    {
      step: "STEP2",
      title: "방문 일정을 잡아드려요",
      description: "원하시는 시간과 장소로 전문가가 방문합니다"
    },
    {
      step: "STEP3",
      title: "견적을 확인하세요",
      description: "차량 상태 확인 후 직거래 최적가를 알려드립니다"
    },
    {
        step: "STEP4",
        title: "차량 판매를 시작해요",
        description: "각종 사이트에 매물을 업로드하고 문의에 응대해요"
      },
    {
        step: "STEP5",
        title: "구매자와 약속을 잡아드려요",
        description: "문의 응대 후 차량을 직접 보고싶은 구매 희망자만 약속을 잡아드려요"
    },
    {
      step: "STEP6",
      title: "거래 완료",
      description: " 구매자와 거래 후 수수료를 입금해주시면 됩니다"
    }
  ];

  const articles = [
    {
      number: "01",
      title: "믿을 수 있는 전문가가",
      description: "내차 팔 때 함께 해요",
    //   image: "/images/car-inspection.jpg"
    },
    {
      number: "02",
      title: "매물 업로드부터 고객 상담까지",
      description: "윈윈딜이 맡아서 진행해요",
    //   image: "/images/online-consultation.jpg"
    },
    {
      number: "03",
      title: "상담 완료 후",
      description: "구매자와 만남 시간을 조율해드려요",
    //   image: "/images/service-coordination.jpg"
    },
    {
      number: "04",
      title: "명의 이전도 차량이 위치한",
      description: "현장에서 진행할 수 있어요",
    //   image: "/images/expert-meeting.jpg"
    }
  ];

  const faqs = [
    {
      question: "방문 견적은 무료인가요?",
      answer: "네, 방문 견적은 완전 무료입니다. 부담 없이 신청해주세요."
    },
    {
      question: "판매 수수료는 얼마인가요?",
      answer: "투명한 거래를 위해 모든 비용을 사전에 안내해드립니다."
    },
    {
      question: "어떤 차종이든 판매가 가능한가요?",
      answer: "국산/수입차 상관없이 모든 차종의 판매를 도와드립니다."
    },
    {
      question: "서비스 이용 절차가 어떻게 되나요?",
      answer: "고객님은 서비스 신청만 하시면 끝! 판매글 등록, 판매 상담 등 번거로운 절차는 윈윈딜이 책임지고 진행해요."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A]">
        <Header 
          title="" 
          className="bg-transparent"
          leftButton={
            <button 
              onClick={() => navigate(-1)} 
              className="material-icons text-white"
            >
              arrow_back
            </button>
          }
        />
        <div className="px-5 pt-16">
          <h1 className="text-white text-2xl font-bold mb-3">
            열심히 관리해온 내차,<br />
            이것 밖에 못받는다고?
          </h1>
          <p className="text-gray-400">
            이제 윈윈딜과 함께 <br />
            직거래하고 제값 받으세요!
          </p>
        </div>
        <button
          onClick={() => window.location.href = 'https://naver.me/GbDVH4DG'}
          className="absolute bottom-6 left-5 right-5 bg-[#00de6e] text-white py-4 rounded-xl font-medium"
        >
          직거래 최적가 무료로 확인하기
        </button>
      </section>

      {/* Main Content */}
      <section className="px-5 py-8">
        {/* Pain Points */}
        <div className="mb-12">
          <h2 className="text-black text-xl font-bold mb-6">
            차 팔 때 겪는 그 찝찝함, 
            < br/>아시나요?
          </h2>
          <div className="bg-[#2A2A2A] p-5 rounded-xl mb-4">
            <p className="text-gray-400 text-lg font-medium mb-2">
              불과 2일 후에 400만원<br />
              더 올려서 판매중? 🤔
            </p>
            <p className="text-white text-lg font-bold">
              혹시,<br />
              내차도 더 받을 수 있었던거 아닐까?
            </p>
          </div>
          
        </div>

        {/* Service Benefits */}
        <div className="mb-12">
          <h2 className="text-black text-xl font-bold mb-6">
            WW:D과 함께하는<br />
            직거래는 이렇게 다릅니다
          </h2>
          <div className="space-y-4">
            {articles.map((article, index) => (
              <div key={index} className="bg-[#2A2A2A] p-5 rounded-xl">
                <span className="text-gray-400 text-sm mb-2 block">
                  {article.number}
                </span>
                {article.image && (
                  <div className="mb-4">
                    <img 
                      src={article.image} 
                      alt="" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <h3 className="text-white font-medium mb-1">{article.title}</h3>
                <p className="text-gray-400 text-sm">{article.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-12">
          <h2 className="text-black text-xl font-bold mb-6">
            이렇게 <br />진행됩니다
          </h2>
          <div className="space-y-4">
            {steps.map((item, index) => (
              <div key={index} className="bg-[#2A2A2A] p-5 rounded-xl">
                <span className="text-[#6D3DFF] text-sm font-medium mb-2 block">
                  {item.step}
                </span>
                <h3 className="text-white font-medium mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-24">
          <h2 className="text-black text-xl font-bold mb-6">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[#2A2A2A] p-5 rounded-xl">
                <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                <p className="text-gray-400 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <div className="fixed bottom-[72px] left-0 right-0 z-10">
        <div className="px-5 max-w-[480px] mx-auto">
          <div className="flex justify-between items-center mb-3">
            {/* <span className="text-gray-400 text-xs">Contact us</span>
            <a href="tel:010-2407-9214" className="text-white text-xs">
              tel. 000-2407-9214
            </a> */}
          </div>
          <button 
              onClick={() => {
                // setShowBannerSheet(false);
                // navigate('/sell');
                window.location.href = 'https://naver.me/GbDVH4DG'
              }}
              className="w-full bg-[#00de6e] text-white py-4 rounded-xl font-medium hover:bg-gray-400 transition-colors duration-200"
            >
              내차 직거래 최적가 무료 확인
            </button>
        </div>
      </div>
    </div>
  );
};

export default SellLanding; 