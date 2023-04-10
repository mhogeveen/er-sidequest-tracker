import { Npc } from '@src/types'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
} from '@radix-ui/react-icons'
import { ReactEventHandler, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './NpcSideQuest.module.scss'
import { Checkbox } from '../Checkbox'
import { Accordion } from '../Accordion'
import { NpcSideQuestStep } from '../NpcSideQuestStep'
import { useNpcLocalStorage } from '@src/hooks/useLocalStorage'

type NpcSideQuestProps = {
  data: Npc
  isOpenByDefault?: boolean
}

export const NpcSideQuest = ({
  data,
  isOpenByDefault = false,
}: NpcSideQuestProps) => {
  const { localStorageValue, setLocalStorageTotal } = useNpcLocalStorage(
    data.id
  )
  const [isOpen, setIsOpen] = useState(isOpenByDefault)

  const handleToggle: ReactEventHandler<HTMLDetailsElement> = (e) => {
    e.stopPropagation()
    const target = e.target as HTMLDetailsElement
    setIsOpen(target.open)
  }

  return (
    <Accordion
      classes={{
        summary: styles.summary,
      }}
      content={
        <NpcSideQuestContent
          failureConditions={data.failureConditions}
          id={data.id}
          rewards={data.rewards}
          steps={data.steps}
        />
      }
      summary={
        <NpcSideQuestSummary
          description={data.description}
          isNpcComplete={!!localStorageValue?.total}
          isOpen={isOpen}
          link={data.link}
          name={data.name}
          toggleNpcComplete={(state) => setLocalStorageTotal(state)}
        />
      }
      handleToggle={handleToggle}
      isOpen={isOpen}
    />
  )
}

type NpcSideQuestSummaryProps = Pick<Npc, 'description' | 'link' | 'name'> & {
  isNpcComplete: boolean
  isOpen: boolean
  toggleNpcComplete: (state: boolean) => void
}

const NpcSideQuestSummary = ({
  description,
  isNpcComplete,
  isOpen,
  link,
  name,
  toggleNpcComplete,
}: NpcSideQuestSummaryProps) => {
  return (
    <>
      <div className={styles.checkbox}>
        <Checkbox isChecked={isNpcComplete} onClick={toggleNpcComplete} />
      </div>
      <h2 className={styles.title}>{name}</h2>
      <a href={link} target="_blank" className={styles.link}>
        <ExternalLinkIcon width={20} height={20} />
      </a>
      <div className={styles.description}>
        <ReactMarkdown linkTarget="_blank">{description}</ReactMarkdown>
      </div>
      <i className={styles.chevron}>
        {isOpen ? (
          <ChevronUpIcon width={20} height={20} />
        ) : (
          <ChevronDownIcon width={20} height={20} />
        )}
      </i>
    </>
  )
}

type NpcSideQuestContentProps = Pick<
  Npc,
  'failureConditions' | 'id' | 'rewards' | 'steps'
>

const NpcSideQuestContent = ({
  id,
  failureConditions,
  rewards,
  steps,
}: NpcSideQuestContentProps) => {
  return (
    <>
      {!!failureConditions?.length ? (
        <>
          <h3>Failure conditions</h3>
          <ul className={styles.list}>
            {failureConditions.map((condition, index) => (
              <li key={index}>
                <ReactMarkdown linkTarget="_blank">{condition}</ReactMarkdown>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {!!rewards?.length ? (
        <>
          <h3>Rewards</h3>
          <ul className={styles.list}>
            {rewards.map((reward) => (
              <li key={reward.id}>
                {`x${reward.amount} - `}
                <a href={reward.link} target="_blank">{`${reward.name}`}</a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {!!steps.length ? (
        <>
          <h3>Steps</h3>
          <div>
            {steps.map((step) => (
              <NpcSideQuestStep
                key={step.id}
                data={step}
                isOpenByDefault={false}
                npcId={id}
              />
            ))}
          </div>
        </>
      ) : null}
    </>
  )
}
