import { getSourcemaps } from '@logbun/app/actions';
import { EventResultResponse } from '@logbun/app/types';
import Stack from './stack';

interface Props {
  projectId: string;
  event: EventResultResponse;
}

export default async function Stacktrace({ projectId, event }: Props) {
  const { release, stacktrace, level } = event;

  const frames = await getSourcemaps({ projectId, release, stacktrace });

  return (
    <div className="px-5 bg-white divide-y rounded-lg shadow p-b shadow-gray-100 ring-1 ring-gray-200/50">
      <Stack level={level} frames={frames} />
    </div>
  );
}
