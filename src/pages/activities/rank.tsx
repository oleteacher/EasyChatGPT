import { QNADialog } from '@components/Dialog';
import { useState } from 'react';

interface RankItemProps {
  rank: number;
}
const RankItem = ({ rank }: RankItemProps) => {
  const rankText = ['🥇', '🥈', '🥉'];

  return (
    <div className='flex flex-col items-center justify-between md:flex-row'>
      <div className='flex flex-row items-center gap-2'>
        <div
          className={`
          ${rank <= 3 ? '-ml-2 w-8' : ''}
          text-center text-4xl font-bold text-gray-700
          `}
        >
          {rank <= 3 ? rankText[rank - 1] : rank}
        </div>
        <div className='flex flex-col'>
          <div className='text-md font-bold underline'>
            What is the introduction of the Worldcoin project?
          </div>
        </div>
      </div>
      <div className='flex gap-2 self-end rounded-full bg-indigo-600 p-2 py-1 text-sm hover:bg-indigo-700 md:self-center'>
        <div>🔥</div>
        <div className='cursor-pointer font-bold'>Vote (376)</div>
      </div>
    </div>
  );
};

export const RankPage = () => {
  const [openRules, setOpenRules] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  return (
    <div className='flex flex-col gap-2 bg-bg-50 p-4 text-white'>
      <div
        hidden={!showTitle}
        className={`relative mb-2 flex flex-col overflow-hidden  rounded-lg bg-gradient-to-b from-pink-600 to-purple-500 p-4 text-sm text-gray-50`}
      >
        <div
          className='absolute left-0 top-1/4 z-0 opacity-10'
          style={{
            fontSize: '200px',
          }}
        >
          🔥
        </div>
        <div>
          <h3 className='z-1 relative mt-3 mb-3 text-xl font-extrabold tracking-tight text-white '>
            Vote for your favorite question!
          </h3>
          <div className='z-1 relative'>
            The supporters of the <strong>top 3</strong> questions will share
            the credits pool.
          </div>
        </div>
        <div
          className='z-1 relative mt-4 max-w-fit cursor-pointer self-end rounded-full border p-2 py-1 md:self-start'
          onClick={() => setOpenRules(true)}
        >
          Check the rules
        </div>
        <div
          className='absolute right-2 top-2 cursor-pointer p-2'
          onClick={() => setShowTitle(false)}
        >
          <svg
            width='15'
            height='15'
            viewBox='0 0 11 12'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M4.55709 5.9999L0.314454 1.75726L1.25726 0.814453L5.4999 5.05709L9.74254 0.814453L10.6854 1.75726L6.44271 5.9999L10.6854 10.2425L9.74254 11.1854L5.4999 6.94271L1.25726 11.1854L0.314453 10.2425L4.55709 5.9999Z'
              fill='white'
            />
          </svg>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <RankItem rank={1} />
        <RankItem rank={2} />
        <RankItem rank={3} />
        <RankItem rank={4} />
        <RankItem rank={5} />
      </div>
      <QNADialog
        isOpen={openRules}
        onClose={() => setOpenRules(false)}
        title='Voting Rules'
      >
        <div className='p-4 pb-6 text-white'>
          <ul className='flex flex-col gap-2 text-sm'>
            <li>
              1. The above questions are the top 10 most popular questions from
              last week.
            </li>
            <li>
              2. You can vote for all the questions you like. You can vote
              multiple times for a single question. Each vote costs 5 credits
              from your external wallet.
            </li>
            <li>
              3. The voting deadline is fixed weekly. After the deadline, the
              voters of the 1st question can share 10,000 credits equally, the
              voters of the 2nd question can share 5,000 credits, and the voters
              of the 3rd question can share 1,000 credits.
            </li>
          </ul>
        </div>
      </QNADialog>
    </div>
  );
};
