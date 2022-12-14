import type { Context } from '@actions/github/lib/context';
import type { Octokit } from '@technote-space/github-action-helper/dist/types';
import type { Logger } from '@technote-space/github-action-log-helper';
import { createCards } from './utils/card';
import { getColumnIds } from './utils/column';
import { getContentId, getContentType } from './utils/context';
import { getProjectName, getColumnName } from './utils/misc';
import { getProjectIds } from './utils/project';

export const execute = async(logger: Logger, octokit: Octokit, context: Context): Promise<boolean> => {
  const projectName = getProjectName();
  const columnName  = getColumnName();
  logger.startProcess('project: %s, column: %s', projectName, columnName);

  logger.startProcess('Getting target projects...');
  const projectIds = await getProjectIds(projectName, octokit, context);
  if (projectIds.length) {
    console.log(projectIds);
  } else {
    logger.warn('There are no target projects.');
    return false;
  }

  logger.startProcess('Getting target columns...');
  const columnIds = await getColumnIds(projectIds, columnName, octokit);
  if (columnIds.length) {
    console.log(columnIds);
  } else {
    logger.warn('There are no target columns.');
    return false;
  }

  logger.startProcess('Creating cards...');
  const results = await createCards(columnIds, getContentId(context), getContentType(context), logger, octokit);
  console.log(results);

  return true;
};
