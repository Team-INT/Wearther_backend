export const TODAY_DATE_TXT = '오늘 날짜';
export const START_DATE_TXT = '시작 날짜';
export const END_DATE_TXT = '종료 날짜';
export const REQUIRED_FIELD_TXT = '필수 항목';
export const OPTIONAL_FIELD_TXT = '옵션 항목';
export const SEARCH_BTN_TXT = 'SEARCH';
export const INPUT_KEYWORD_PLACEHOLDER = '키워드를 입력하세요';
export const SELECT_FORM_PLACEHOLDER = '카테고리';
export const INTRODUCE_MSG = '쇼핑인사이트 키워드/연령별 트렌드 조회';
export const NO_DATA_MSG = '데이터가 없어요! \n필수 항목을 모두 입력한 후 검색해보세요';

const age = ['10', '20', '30', '40', '50', '60'];
export const ageList = age.map((el) => ({ key: el, label: `${el}대` }));

export const categoryList = [
  {
    key: '50000001',
    label: '패션/잡화',
  },
  {
    key: '50000002',
    label: '화장품/미용',
  },
  {
    key: '50000008',
    label: '패션/의류',
  },
];

export const genderList = [
  {
    key: '',
    label: '전체',
  },
  {
    key: 'm',
    label: '남성',
  },
  {
    key: 'f',
    label: '여성',
  },
];

export const timeUnitList = [
  {
    key: 'date',
    label: '일간',
  },
  {
    key: 'week',
    label: '주간',
  },
  {
    key: 'month',
    label: '월간',
  },
];
