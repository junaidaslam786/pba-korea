import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const db = new PrismaClient();

// ── All 97 real PBA Korea members from the WordPress database ────────────────
const members = [
  { membershipNumber: "72250003", name: "Mr. Rahim Shah", phone: "010-4417-2080", businessName: "Hanatex Trading co.", address: "samsung dong 350-2 yangju city, S.Korea", natureOfBusiness: "Import Export Trading", designation: "President" },
  { membershipNumber: "72250004", name: "Mian Sagheer Ahmad", phone: "+821050122756", businessName: "Daim Autos LTDA", address: "SOUTH KOREA", natureOfBusiness: "Import Export Used Korean Cars", designation: "General Secretary" },
  { membershipNumber: "72250005", name: "Mr. Muhammad Kazim", phone: "010-3324-0786", businessName: "Sahara trading co.ltd", address: "인천시 연수구 옥련동 194-75 수출2단지", natureOfBusiness: "Import Export Trading", designation: "Vice President" },
  { membershipNumber: "72250006", name: "Dr. Song Jong Hwan", phone: "010-5151-0815", businessName: "NA", address: "SOUTH KOREA", natureOfBusiness: "NA", designation: "Chief Advisor" },
  { membershipNumber: "72250007", name: "Mr. Jahanzeb Khan", phone: "010-2360-1786", businessName: "NA", address: "SOUTH KOREA", natureOfBusiness: "NA", designation: "Cabinet Member (Ex-President)" },
  { membershipNumber: "72250008", name: "Mr. Mehar Muhammad Sarwar", phone: "010-5779-5696", businessName: "Tradeways international", address: "Incheon Yunsu Gu HanjinRo 77, 203-1005", natureOfBusiness: "Import Export Trading", designation: "Member Advisory Board" },
  { membershipNumber: "72250009", name: "Mr. Muhammad Asghar Bangi", phone: "010-9129-2755", businessName: "Asia Pacific Enterprises", address: "101-502, 10 Saengyeon-ro, Dongducheon-si, Gyeonggi-do", natureOfBusiness: "Import Export Trading", designation: "Member Advisory Board" },
  { membershipNumber: "72250010", name: "Mr. Malik Nadeem", phone: "010-9522-0786", businessName: "Nadeem International Co. LTD", address: "대구광역시 달서구 문화회관길 254 (장동) 302", natureOfBusiness: "Import Export Trading", designation: "Member Advisory Board" },
  { membershipNumber: "72250011", name: "Mr. Mian Mohammad Shakeel", phone: "010-2642-2317", businessName: "PAK MADINA COMPANY LTD.", address: "인천시 연수구 능허대로 222", natureOfBusiness: "Import Export Trading", designation: "Head Central Executive Cabinet" },
  { membershipNumber: "72250012", name: "Mr. Raja Amir Iqbal", phone: "010-9404-0786", businessName: "RB Vision", address: "59, Habinnam-ro 104-gil, habin-myeon, Dalseong-gun, Daegu", natureOfBusiness: "Import Export Trading", designation: "Coordinator" },
  { membershipNumber: "72250013", name: "Mr. Shafi Khan", phone: "010-2159-1700", businessName: "Noor Trading Co., Ltd", address: "Yeonsu-gu Incheon", natureOfBusiness: "Import Export Trading", designation: "Cabinet Member" },
  { membershipNumber: "72250014", name: "Mr. Haji Kafayat Ullah", phone: "010-2368-1214", businessName: "KAFAYAT INTERNATIONAL CO., LTD.", address: "인천광역시 중구 축항대로 234, 11-409", natureOfBusiness: "Import Export Trading", designation: "Head Membership Committee" },
  { membershipNumber: "72250015", name: "Mr. Amir Kolar", phone: "010-2780-4545", businessName: "KOLAR TRADING CO,LTD", address: "Gyeonggi-do Hwaseong-si Namyang-eup Onseok-ri 77", natureOfBusiness: "Import Export Trading", designation: "Head of Event Management" },
  { membershipNumber: "72250016", name: "Mr. Dildar Hussain Kashif", phone: "010-5603-6611", businessName: "MIR TRADING CO.", address: "483,Aam-daero,Yeonsu-gu,export center incheon", natureOfBusiness: "Import Export Trading", designation: "Head Finance Affairs" },
  { membershipNumber: "72250017", name: "Dr. Mian Sabir Hussain", phone: "010-2225-9222", businessName: "ASK-Trade Korea", address: "인천 연수구 옥련동 170-14 203호", natureOfBusiness: "Import Export Trading", designation: "Information" },
  { membershipNumber: "72250018", name: "Mr. Rana Shahid Mehmood", phone: "010-8024-4541", businessName: "Rajpoot International Co. LTD.", address: "Rajpoot International Co. LTD.", natureOfBusiness: "Import Export Trading", designation: "Head Used Machinery Business" },
  { membershipNumber: "72250019", name: "Mr. Jamal Saud", phone: "010-4644-2786", businessName: "No 1 GYM", address: "강남구 신사동 662-11 3층 301호", natureOfBusiness: "Import Export Trading", designation: "Health & Sports Affairs" },
  { membershipNumber: "72250020", name: "Mr. Anwar Kim", phone: "010-9939-3614", businessName: "Sony International Trading Co LTD", address: "902 KangNam place View, Giheung Gu Yongin City", natureOfBusiness: "Import Export Trading", designation: "Culture Promotion Representative" },
  { membershipNumber: "72250021", name: "Mrs. Fatima Kim", phone: "010-4665-3614", businessName: "Fatima International Co", address: "92 Gangnam-dong-ro, Giheung-gu, Yongin-si", natureOfBusiness: "Import Export Trading", designation: "Culture Promotion Representative" },
  { membershipNumber: "72250022", name: "Mr. Rana Anjum", phone: "010-4965-3614", businessName: "Korea 무역", address: "포항시 남구 대송면 제내리 1032 1층", natureOfBusiness: "Import Export Used Korean Cars", designation: "Head Used Cars Business" },
  { membershipNumber: "72250023", name: "Mr. Hafiz M Junaid Ali", phone: "010-2932-2733", businessName: "BELLE KR", address: "Apt. 3704 Bldg. 108 Ansan PRUGIO, Danwong-gu, Ansan-si", natureOfBusiness: "Brand Owner, E-commerce", designation: "Head Alumni & Professional Network" },
  { membershipNumber: "72250024", name: "Mr. Afzal Gujjar", phone: "010-8410-7815", businessName: "NA", address: "304 room #1166, Jeongwang-Dong, Siheung", natureOfBusiness: "NA", designation: "Social Welfare Promoter" },
  { membershipNumber: "72250025", name: "Mr. Zahid Mahmood", phone: "010-2609-2694", businessName: "Aone Halal", address: "경기도 안산시 상록구 사동 1199-7 101호", natureOfBusiness: "Import Export Trading", designation: "Pakistani Food Promoter" },
  { membershipNumber: "72250026", name: "Mr. Hanif Ullah", phone: "010-4142-0297", businessName: "Hani Global", address: "대구광역시 서구 국채보상로 21길 13(이현동)", natureOfBusiness: "Import Export Trading Textile", designation: "Head Textile Business" },
  { membershipNumber: "72250027", name: "Mr. Mardan Ali Qadri", phone: "010-9690-0786", businessName: "ALI TRADING", address: "인천연수구 동춘동 820-45, 1층", natureOfBusiness: "Import Export Trading", designation: "Community Integration & Worker's Right Affairs" },
  { membershipNumber: "72250028", name: "Mr. M Amjad Sial", phone: "010-5548-9938", businessName: "SIAL AUTO PARTS CO.LTD", address: "716-2 Cheongwon-ri, Mado-myeon, Hwaseong-si", natureOfBusiness: "Import Export Trading AUTO PARTS", designation: "Head Trade Affairs" },
  { membershipNumber: "72250029", name: "Mr. Rana Niaz Ahmed", phone: "010-6319-9947", businessName: "Roman Trader", address: "경기도 파주시 다율로10 파주운정신도시", natureOfBusiness: "Import Export Trading", designation: "Head Export Development" },
  { membershipNumber: "72250030", name: "Mr. Ahmad Nawaz", phone: "010-5944-9786", businessName: "MANDAL IMPEX", address: "부산관역시 사상구 사상로90번길 4, 101호", natureOfBusiness: "Import Export Trading", designation: "Head Volunteers" },
  { membershipNumber: "72250031", name: "Mr. Aamir Latif Butt", phone: "010-9791-1432", businessName: "H.A INTERNATIONAL CO.,LTD.", address: "경상북도 경주시 강동면 인동새들길 5 203호", natureOfBusiness: "Import Export Trading", designation: "Business Cooperation & Promotion Head" },
  { membershipNumber: "72250032", name: "Mr. M Arshad Cheema", phone: "010-6637-0786", businessName: "Cheema Brothers Co. LTD", address: "대구광역시 달서구 문화회관길 254 (장동) 301호", natureOfBusiness: "Import Export Trading", designation: "Member Welfare Cooperation" },
  { membershipNumber: "72250033", name: "Mr. Malik Qasim Ali", phone: "010-3401-2088", businessName: "알리 무역", address: "대구광역시 달성군 하빈면 달구벌대로 12길 229-3", natureOfBusiness: "Import Export Trading", designation: "Member Welfare Cooperation" },
  { membershipNumber: "72250034", name: "Mr. Imtiaz Ahmad", phone: "010-3631-2042", businessName: "HAMNA TRADING CO.LTD.", address: "대구광역시 달서구 용산큰못3길 10, 102호", natureOfBusiness: "Import Export Trading", designation: "Member Welfare Cooperation" },
  { membershipNumber: "72250035", name: "Mr. Nadeem Chaudhary", phone: "010-8623-1786", businessName: "ZAM ZAM TRADING", address: "Gyeonggi do Gwangju si", natureOfBusiness: "Import Export Trading", designation: "Member Welfare Cooperation" },
  { membershipNumber: "72250036", name: "Mr. Khan Muhammad Shafiq", phone: "010-2228-0586", businessName: "Umair korean cop", address: "Kajadong incheon city korea", natureOfBusiness: "Import Export Trading", designation: "Head Welfare" },
  { membershipNumber: "72250037", name: "Mr. Rana Khalid Manjj", phone: "010-3040-1575", businessName: "알케이 인터내셔널 (주)", address: "대구광역시 달서구 성서공단로 389 2층 201호", natureOfBusiness: "Import Export Trading", designation: "Member Welfare Cooperation" },
  { membershipNumber: "72250038", name: "Kim Sun Hee", phone: "010-2415-6728", businessName: "김스인터내셔널", address: "경기도 동두천시 강변로 506-18", natureOfBusiness: "Global export metal and motors", designation: "Cabinet Member" },
  { membershipNumber: "72250039", name: "Qamar Abbas Cheema", phone: "010-8387-3383", businessName: "씨앤씨무역 (CUI CHEEMA TRADER)", address: "경기도 양주시 광적면 현석로 743-10", natureOfBusiness: "Import Export Trading", designation: "Cabinet Member" },
  { membershipNumber: "72250040", name: "Nabeel Hussain", phone: "010-7202-7124", businessName: "Nabeel Trading Co. LtD", address: "인천광역시 연수구 능허대로 192", natureOfBusiness: "Used Cars", designation: "Member" },
  { membershipNumber: "72250041", name: "Amir Hamza", phone: "010-3013-9444", businessName: "H Trading", address: "Yangju Songsung-Dong xai 407-502", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250042", name: "Usman Muhammad", phone: "010-8746-0764", businessName: "Al Noman International LTD.", address: "Seoul Chong-kiu myeon dong 2-53", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250043", name: "Ghufran Ullah", phone: "010-7560-0764", businessName: "ZEB Textile", address: "Yangju Chong bong sam ro 314-64", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250044", name: "Siddiqi Adnan Farid", phone: "010-2257-2314", businessName: "Misco LTD", address: "Seoul Guro digital-ro 31-41", natureOfBusiness: "Electronics", designation: "Member" },
  { membershipNumber: "72250045", name: "Ahmad Nauman", phone: "010-2500-9553", businessName: "NAB Traders", address: "Yangju Sansung-Dong 90-2", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250046", name: "Farooq Khan", phone: "010-9736-4855", businessName: "Farooq Trading, Taj Palace", address: "양주시 덕정 1 gil 10", natureOfBusiness: "Textile & Food", designation: "Member" },
  { membershipNumber: "72250047", name: "USMAN", phone: "010-8844-2116", businessName: "Farooq Trading", address: "양주시 덕정 1 gil 10", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250048", name: "Ayub Khan", phone: "010-9540-4467", businessName: "Namsan Trading Co. LTD", address: "경기도 양주시 만송로330번길 3", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250049", name: "Salman Bakht", phone: "010-5920-2080", businessName: "Namson Trading Co. LTD", address: "Yangju City monsung-Dong 105-9", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250050", name: "Naeem Bakht", phone: "0106629-8126", businessName: "Namson Trading Co. LTD", address: "Yangju City monsung-Dong 105-9", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250051", name: "MUSTANSAR JAVED CHAUDHRY", phone: "010-4300-7901", businessName: "JAVED TRADING", address: "194-75 Ongnyeon-dong, Yeonsu-gu, Incheon", natureOfBusiness: "USED cars and parts exporter", designation: "Workers Focal Person" },
  { membershipNumber: "72250052", name: "Khan Muhammad Ayub", phone: "010-8280-2944", businessName: "BAZAN Trading", address: "Yangju City Okjeong Dong", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250053", name: "Khan Bashir", phone: "010-2300-3155", businessName: "KBR Trading", address: "Yangju City Chongdam Ro 116-130", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250054", name: "Ayub Khan", phone: "010-6709-2272", businessName: "KBR Trading", address: "Yangju City Chongdam Ro 116-130", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250055", name: "Mazhar Khan", phone: "010-9063-6479", businessName: "Zaryab Trading", address: "Yangju City Chongdam Ro 116", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250056", name: "Shahriyar", phone: "010-2801-3435", businessName: "Zaryab Trading", address: "Yangju City Chongdam Ro 116", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250057", name: "Muhammad Noor", phone: "010-2234-4425", businessName: "MUMAND Textile", address: "Yangju City Chongdam Ro 84", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250058", name: "Imran Muhammad", phone: "010-9919-7713", businessName: "SHAHEEN Trading", address: "Yangju City Kwajong myeon Karibi gil 79-30", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250059", name: "Ahmad Ali Shah", phone: "010-3141-6007", businessName: "QAYUM Trading", address: "Yangju City Sansung Dong 350-2", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250060", name: "INAM ULLAH", phone: "010-5426-9290", businessName: "KHANTEX LTD", address: "Yangju City monsung-Dong 105-9", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250061", name: "QAISAR MEHMOOD", phone: "010-2217-0786", businessName: "SWATI", address: "Uijeongbu hokok-ro 1051-17", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250062", name: "ABDUL QAYUM", phone: "010-7706-4447", businessName: "QAYUM Trading", address: "Yangju City Sansung Dong 350-2", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250063", name: "AKHTAR JAMIL", phone: "010-8267-2080", businessName: "KHANTEX LTD", address: "Yangju City monsung-Dong 105-9", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250064", name: "Arfan Ali Muhammad", phone: "010-6679-1588", businessName: "GB WORLD TRADE CO LTD.", address: "39, Bongdong-ro 95 beongil dongducheon-si", natureOfBusiness: "Textile, Plastic Paper, Stock Lot", designation: "Member" },
  { membershipNumber: "72250065", name: "Shakil Muhammad", phone: "010-3184-2012", businessName: "H.S 트레이딩", address: "경기도 동두천시 송터로 42-1 나동 102호", natureOfBusiness: "Import Export Used Korean Cars", designation: "Member" },
  { membershipNumber: "72250066", name: "Anwar Hussain", phone: "010-4086-6098", businessName: "에츠엠트레딩", address: "경기도 파주시 조리읍 등원로 322-5", natureOfBusiness: "Motors, Circuit Breaker", designation: "Member" },
  { membershipNumber: "72250067", name: "Raja Muhammad Aslam", phone: "010-8073-7005", businessName: "라자케이", address: "인천시 서구 건지로 366번길 8-1 302호", natureOfBusiness: "Used Machinery & Motors", designation: "Member" },
  { membershipNumber: "72250068", name: "Adil Islam", phone: "010-2195-6728", businessName: "희나 인터네셔널", address: "경기도 양주시 광적면 삼일로 29번길 205, 201호", natureOfBusiness: "Used Motors", designation: "Member" },
  { membershipNumber: "72250069", name: "Sohail Aslam", phone: "010-6727-1655", businessName: "디에 트레이딩", address: "부산광역시 동구 중앙대로 286번길 10, 101동 3305호", natureOfBusiness: "Food & Electronics", designation: "Member" },
  { membershipNumber: "72250070", name: "Rasheed Ahmad Khan", phone: "010-3822-4736", businessName: "R S TRADERS", address: "경기도 양주시 남면 감악산로 83번길 133", natureOfBusiness: "Motors, Circuit Breaker", designation: "Member" },
  { membershipNumber: "722500701", name: "Irfan Ghafoor", phone: "010-8059-6112", businessName: "Korea Global Network", address: "경기도 부천시 중동 755. 501호", natureOfBusiness: "Used Phones, E-commerce", designation: "Member" },
  { membershipNumber: "72250072", name: "Asif Ali", phone: "010-6877-0786", businessName: "HANA TRADING", address: "경기 양주시 광적면 삼일로247번길 16", natureOfBusiness: "METAL SCRAP", designation: "Member" },
  { membershipNumber: "72250073", name: "Hafeez Ahmad", phone: "010-2613-2405", businessName: "알하피즈 트레이딩", address: "서울시 금천구 독산로 77길 22, 104호", natureOfBusiness: "Trading, Export", designation: "Member" },
  { membershipNumber: "72250074", name: "Tariq Khan", phone: "010-4253-0786", businessName: "HINA TRADERS", address: "전라북도 익산시 무왕로 779-30 (현영동)", natureOfBusiness: "Trading, Export", designation: "Member" },
  { membershipNumber: "72250075", name: "Rana Muhammad Arfan", phone: "010-3024-9110", businessName: "ETTEHAD TRADING", address: "경기 양주시 광적면 삼일로247번길 16", natureOfBusiness: "USED MACHINERY", designation: "Member" },
  { membershipNumber: "72250076", name: "Ali Aourangzeb", phone: "010-8819-4015", businessName: "ZAIB TRADING", address: "양주시 은현면 운하로 422-96", natureOfBusiness: "Motors, Circuit Breaker", designation: "Member" },
  { membershipNumber: "72250077", name: "Mehmood Kashif", phone: "010-2804-4015", businessName: "MALIK TRADING Co.", address: "경기도 동두천시 지행로 125, 3동 101호", natureOfBusiness: "Trading, Export", designation: "Member" },
  { membershipNumber: "72250078", name: "Mehmood Nasir Bajwa", phone: "010-8060-0426", businessName: "BAJWA TRADING", address: "경기도 양주시 백석읍 꿈나무로 45, B동 303호", natureOfBusiness: "Scrap, Used Machinery", designation: "Member" },
  { membershipNumber: "72250079", name: "Wali Sardar", phone: "010-4832-7798", businessName: "SDR TRADING CO", address: "경기도 의정부시 신흥로353번길 23", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250080", name: "AZIZ AHMAD", phone: "010-5570-5733", businessName: "KHAS TRADING", address: "DAEGU DALSEO GU JANGGI RO 160 SKY APART 105,202", natureOfBusiness: "USED EXCAVATOR", designation: "Member" },
  { membershipNumber: "72250081", name: "Mannan Fazal", phone: "010-7471-4062", businessName: "Mannan Trading", address: "경기도 양주시 덕정5길 6, 102호", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250082", name: "Muhammad Tahir", phone: "010-3782-0786", businessName: "TM.Trading", address: "경기도 양주시 칠봉산로 168번길84", natureOfBusiness: "Used Clothes", designation: "Member" },
  { membershipNumber: "72250083", name: "Rafiq Shah", phone: "010-6875-2541", businessName: "shah trading co ltd", address: "yangju city samsung dong 90-2", natureOfBusiness: "Textile", designation: "Member" },
  { membershipNumber: "72250084", name: "ANAS MUHAMMAD", phone: "010-3275-0786", businessName: "TM TRADING", address: "경기도 양주시 칠봉산로168번길84 봉양동", natureOfBusiness: "Used Clothes", designation: "Member" },
  { membershipNumber: "72250085", name: "Khan Rasheed", phone: "010-6821-4763", businessName: "Khan international trading", address: "경기도 고양시 덕양구 지도로124번길 8-10, B동 303호", natureOfBusiness: "Trading, Export", designation: "Member" },
  { membershipNumber: "72250086", name: "Yousaf Nadeem", phone: "010-6878-7317", businessName: "YOUSAF TRADING", address: "경기도 파주시 법원읍 보광로 1722", natureOfBusiness: "Trading, Export", designation: "Member" },
  { membershipNumber: "72250087", name: "Abbas Azhar", phone: "010-8385-1214", businessName: "FAMILY WORLD MART", address: "경기도 양주시 광적면 가래비10길 17-14", natureOfBusiness: "HALAL FOOD", designation: "Member" },
  { membershipNumber: "72250088", name: "Muhammad Tamseel", phone: "010-2968-0766", businessName: "TAWS INTERNATIONAL", address: "경기도 평택시 청북읍 가마을안길 28-17", natureOfBusiness: "Trading, Export", designation: "Member" },
  { membershipNumber: "72250089", name: "Abdul Rauf", phone: "010-3885-7317", businessName: "ARCHI TRADING Co. Ltd.", address: "경기도 고양시 덕양구 유산길 17번길 48 115동 B01호", natureOfBusiness: "Trading, Export", designation: "Member" },
  { membershipNumber: "72250090", name: "SARWAR GHULAM", phone: "010-3943-4326", businessName: "밴스드레딩", address: "경기도 화성시 정남면 만년로 397-39", natureOfBusiness: "E-commerce, Import, Export", designation: "Member" },
  { membershipNumber: "72250091", name: "Taib Manak Ali", phone: "010-7651-0776", businessName: "AL TAIB & CO", address: "세종특별자치시 장군면 은용1길 47-7, B동 103호", natureOfBusiness: "Trading, Export", designation: "Member" },
  { membershipNumber: "72250092", name: "Naeem Hassan", phone: "010-6683-7342", businessName: "MAJOKA TRADERS", address: "서울시 성북구 들곶이로 22가길 30", natureOfBusiness: "Machinery, Car Parts, Motors", designation: "Member" },
  { membershipNumber: "72250093", name: "Ahmad Shabbir", phone: "010-8615-9521", businessName: "ALI'S RESTAURANT", address: "경기도 포천시 소흘읍 송우로 21번길 4", natureOfBusiness: "Restaurant", designation: "Member" },
  { membershipNumber: "72250094", name: "Shahid Pervaiz", phone: "010-6407-9819", businessName: "마리크 트레이드스", address: "경기도 파주시 파주읍 명학길 27-3", natureOfBusiness: "Trading, Export", designation: "Member" },
  { membershipNumber: "72250095", name: "Abdul Rouf", phone: "010-2242-3397", businessName: "Pakeeza Trading Co.", address: "경기도 부천시 부일로 326, 18, 19호", natureOfBusiness: "Trading, Export, Aluminium", designation: "Member" },
  { membershipNumber: "72250096", name: "Zubair Muhammad", phone: "010-2264-5786", businessName: "개인화물", address: "경기도 이천시 애련정로 87번길 10, 2동 401호", natureOfBusiness: "Transport, Export", designation: "Member" },
  { membershipNumber: "72250097", name: "SHAHZAD MUHAMMAD WASIF", phone: "010-5737-0266", businessName: "WASIF TRADING", address: "경기도 양주시 남면개나리길114,101", natureOfBusiness: "USED CAR EXPORTS", designation: "Member" },
  { membershipNumber: "72250098", name: "Ali Sajid", phone: "010-2350-8776", businessName: "P&K Ali Trading", address: "경기도 동두천시 평화로 2452번길 15, 506호", natureOfBusiness: "Electronic Export", designation: "Member" },
  { membershipNumber: "72250099", name: "Ashraf Muhammad", phone: "010-9443-8241", businessName: "MA TRADERS Co. LTD.", address: "인천광역시 서구 대곡로 326번길 9", natureOfBusiness: "Construction Machinery, Heavy Equipment", designation: "Member" },
];

const events = [
  { title: "PBA Korea Annual General Meeting 2026", slug: "pba-korea-agm-2026", date: new Date("2026-04-15T14:00:00"), location: "Seoul Business Center, Seoul", description: "Annual general meeting for all PBA Korea members. Election of new office bearers and review of annual activities." },
  { title: "Pakistan-Korea Trade Exhibition 2026", slug: "pakistan-korea-trade-exhibition-2026", date: new Date("2026-05-20T10:00:00"), location: "COEX Convention Center, Seoul", description: "Showcasing Pakistani products and services to Korean buyers. Textile, leather, food, and IT sectors represented." },
  { title: "Networking Dinner — Spring 2026", slug: "networking-dinner-spring-2026", date: new Date("2026-04-25T18:30:00"), location: "Grand Hyatt Seoul", description: "Exclusive networking dinner for PBA members and Korean business partners." },
  { title: "Pakistan Independence Day Celebration", slug: "pakistan-independence-day-2026", date: new Date("2026-08-14T17:00:00"), location: "Pakistan Embassy, Seoul", description: "Celebrate Pakistan's Independence Day with the community in Korea." },
  { title: "Business Workshop: E-Commerce in Korea", slug: "ecommerce-workshop-2026", date: new Date("2026-06-25T09:00:00"), location: "Startup Hub Seoul, Gangnam", description: "Learn how to set up and scale e-commerce operations in the Korean market." },
  { title: "PBA Korea New Year Gala 2026", slug: "pba-new-year-gala-2026", date: new Date("2026-01-15T18:00:00"), location: "Lotte Hotel Seoul", description: "New Year celebration and gala dinner with PBA Korea community members and business partners." },
  { title: "Pakistan Day Celebration 2026", slug: "pakistan-day-2026", date: new Date("2026-03-23T15:00:00"), location: "Pakistan Embassy, Seoul", description: "Pakistan Day celebration with flag hoisting ceremony and cultural performances." },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await db.user.upsert({
    where: { email: "admin@pbakorea.org" },
    update: {},
    create: {
      email: "admin@pbakorea.org",
      name: "PBA Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created (admin@pbakorea.org / admin123)");

  // Create all 97 real PBA Korea members
  for (const memberData of members) {
    await db.member.upsert({
      where: { membershipNumber: memberData.membershipNumber },
      update: memberData,
      create: memberData,
    });
  }
  console.log(`✅ ${members.length} members seeded`);

  // Create events
  for (const eventData of events) {
    await db.event.upsert({
      where: { slug: eventData.slug },
      update: eventData,
      create: eventData,
    });
  }
  console.log(`✅ ${events.length} events seeded`);

  // Create sample post
  await db.post.upsert({
    where: { slug: "welcome-to-pba-korea" },
    update: {},
    create: {
      title: "Welcome to the New PBA Korea Website",
      slug: "welcome-to-pba-korea",
      content: "<p>We are delighted to announce the launch of our new website for the Pakistan Business Association Korea. This modern platform will serve as the digital hub for our growing community of Pakistani entrepreneurs and professionals in South Korea.</p><p>The new site features a comprehensive member directory with AI-powered search, event management, and a dedicated admin panel for efficient management of our association's activities.</p><p>We encourage all members to explore the site and reach out through the contact form if you have any suggestions.</p>",
      excerpt: "We are delighted to announce the launch of our new PBA Korea website with modern features and member directory.",
      published: true,
    },
  });
  console.log("✅ Sample post seeded");

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
