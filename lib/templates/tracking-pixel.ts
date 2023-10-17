export type TrackingProps = {
  userId: string;
  emailId: string;
};

const getImage = ({ userId = '', emailId = '' }: TrackingProps) => {
  return `<mj-image src="${process.env.BASE_URL}/api/pixel/${userId}/${emailId}"></mj-image>`
}

export default getImage
