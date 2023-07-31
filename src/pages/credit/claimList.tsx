import useStore from '@store/store';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ClaimItemProps {
  data: ClaimItem;
}

interface ClaimItem {
  id: number;
  user_id: string;
  typ: string;
  sign_day: number;
  sign_in_id: number;
  score: number;
  extra: any | null;
  claimed: boolean;
  created_at: Date;
}
export const ClaimItem = ({ data: item }: ClaimItemProps) => {
  const available = !item.claimed;
  const { t, i18n } = useTranslation();
  const extra = i18n.language === 'en' ? item?.extra?.en : item?.extra?.zh;
  const title = extra?.title;
  const desc = extra?.description;

  return (
    <div
      className={`
    flex flex-col rounded-lg bg-gradient-to-b text-sm  text-gray-50 md:flex-row md:items-center md:justify-between
    ${available ? 'from-indigo-400 to-indigo-500' : 'from-gray-800 to-gray-900'}
    `}
    >
      <div className='p-4 pb-0 md:pb-4'>
        <p className='mb-2 font-bold'>{title}</p>
        <p>{desc}</p>
      </div>
      <div className='p-4'>
        <div
          className={`
          cursor-pointer rounded-lg  p-2 text-center font-bold text-black ${
            available
              ? 'bg-indigo-200 hover:bg-indigo-300'
              : 'cursor-default bg-gray-500'
          }
        `}
        >
          {available
            ? `${t('claim', { ns: 'credit' })} ${item.score} ${t('credits', {
                ns: 'credit',
              })}`
            : 'CLAIMED'}
        </div>
      </div>
    </div>
  );
};

export const ClaimList = () => {
  const claimHistory = useStore((state) => state.claimHistory);
  const getClaimHistory = useStore((state) => state.fetchCreditClaimHistory);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getClaimHistory();
  }, [1]);
  return (
    <div>
      <div className='mb-4 font-bold text-white'>
        {t('credits_claim', { ns: 'credit' })}
      </div>
      <div className='flex flex-col gap-4'>
        {claimHistory?.map((claim) => <ClaimItem data={claim} />)}
      </div>
    </div>
  );
};
