import { Campaign } from '../../lib/models/campaigns';

export const getOpens = (campaign: Campaign | null) =>
  campaign?.users.reduce((acc, curr) => acc + (curr.opens > 0 ? 1 : 0), 0)

export const getUniqueClicks = (campaign: Campaign | null) =>
  campaign?.users.reduce((acc, curr) => acc + (curr.clicks.length > 0 ? 1 : 0), 0)

export const getRate = (count: number, received: number) =>
  parseFloat(((count / received) * 100).toFixed(1))