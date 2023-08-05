import React, { memo, useEffect, useRef, useState } from 'react';
import SearchInput from '@components/Search/searchInput';
import { useMatches, useNavigate, useParams } from 'react-router-dom';
import { getSearchByType, simplifyQuestion } from '@api/api';
import useStore from '@store/store';
import { useAuth0 } from '@auth0/auth0-react';
import { SignInModal, TransparentHeader } from '@components/Header/transparent';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import { searchFuncions } from './variable';
import { SimpleLoading } from './simpleLoading';
import { FreeTip } from '@components/FreeTip';
import { AnswerBlock } from './answerBlock';
import mixpanel from 'mixpanel-browser';
import { CheckInModal } from '@components/Search/checkInModal';
import { track } from '@utils/track';

const SearchResultPage = () => {
  let { question } = useParams();
  const clear = useStore((state) => state.clear);
  const response = useStore((state) => state.response);
  const searchStatus = useStore((state) => state.searchStatus);
  const setSearchStatus = useStore((state) => state.setSearchStatus);
  const getStatusByKey = useStore((state) => state.getStatusByKey);
  const setController = useStore((state) => state.setController);
  const clearController = useStore((state) => state.clearController);
  const setReponse = useStore((state) => state.setResponse);
  const setLoading = useStore((state) => state.setSearchLoading);
  const setResponseOrder = useStore((state) => state.setResponseOrder);
  const fetchCredit = useStore((state) => state.fetchCredit);
  const getCheckinStatus = useStore((state) => state.getCheckinStatus);
  const [searchText, setSearchText] = useState(unescape(question as string));
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const simpleLoadingRef = useRef<any>();

  const handleSubmit = async () => {
    clearController();
    clear();
    if (searchText) {
      track('Search', {
        question: searchText,
        value: searchText,
      });

      if (searchText.length > 150) {
        simpleLoadingRef?.current?.hide();
        return toast.error('Question is too long');
      }
      if (searchText !== question) {
        navigate('/search/' + encodeURIComponent(searchText), {
          replace: true,
        });
      }
      let query = '';
      simpleLoadingRef?.current?.restart();
      let params = new URL(document.location as any).searchParams;
      let originQuestion = params.get('origin_question');
      console.log('originQuestion', originQuestion);
      try {
        if (originQuestion) {
          simplifyQuestion(originQuestion);
          query = originQuestion;
        } else {
          const { data: _query } = await simplifyQuestion(searchText);
          query = _query;
        }
        track('after_simplify');
      } catch (e) {
        track('simplify_error');
        console.log(e);
      }

      getCheckinStatus();
      try {
        //@ts-ignore
        window?.gtag('event', 'search', {
          event_category: 'user_action',
          event_label: searchText,
        });
        //@ts-ignore
        window?.gtag('event', 'conversion', {
          send_to: 'AW-11282287324/5gN0CPL0vs0YENyV6IMq',
        });
      } catch (e) {
        console.log(e);
      }

      fetchCredit();
      searchFuncions.forEach(async (item: any) => {
        setLoading(item.name, true);
        const controller = await getSearchByType({
          type: item.api || item.name,
          query: query,
          originalQuestion: searchText,
          callback: (data: any, isDone: any) => {
            setResponseOrder(item.name);
            setReponse(item.name, data);
            if (isDone) {
              setLoading(item.name, false);
            }
          },
          eventHandler: (event: string, value?: string) => {
            setSearchStatus(item.name, event, value || '');
          },
          onError: () => {
            setLoading(item.name, false);
          },
        });
        setController(controller);
      });
    }
  };

  useEffect(() => {
    handleSubmit();

    return () => {
      clear();
      clearController();
    };
  }, []);
  const closeLoading = searchFuncions.some((item: any) => {
    const s = getStatusByKey(item.name);
    return s === 'message' || s === 'done';
  });

  return (
    <div className='flex min-h-full w-full flex-1 flex-col bg-gray-1000'>
      <div>
        <TransparentHeader showLogo />
      </div>
      <FreeTip />
      <div className='m-auto flex h-full w-full max-w-3xl flex-1 flex-col md:max-w-3xl md:px-4 lg:max-w-3xl xl:max-w-5xl'>
        <div className='bg-bg-50 p-4 md:mt-10 md:bg-transparent md:p-0'>
          <SearchInput
            value={searchText}
            setValue={setSearchText}
            handleSubmit={handleSubmit}
          />
          <div className='block md:hidden'>
            <CheckInModal />
          </div>
        </div>
        <div className='px-2 md:px-0'>
          <SimpleLoading ref={simpleLoadingRef} query={question} />
        </div>
        <div className='mt-0 w-full md:mt-4'>
          <div
            className={`${
              closeLoading ? 'mt-4' : 'hidden'
            } transition-all lg:max-w-fit`}
          >
            {searchFuncions.map((item: any) => {
              if (!response[item.name]) {
                return null;
              }
              return (
                <AnswerBlock
                  key={item.name}
                  searchText={question as string}
                  funcDefination={item}
                  response={response[item.name]}
                  status={getStatusByKey(item.name)}
                />
              );
            })}
          </div>
        </div>
      </div>
      <SignInModal isOpen={loginModalOpen} setIsOpen={setLoginModalOpen} />
    </div>
  );
};

export default SearchResultPage;
