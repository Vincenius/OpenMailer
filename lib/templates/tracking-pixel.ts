export type TrackingProps = {
  userId: string;
  emailId: string;
};

const getImage = ({ userId = '', emailId = '' }: TrackingProps) => {
  return `<mj-image src="${process.env.BASE_URL}/api/pixel/${userId}/${emailId}"></mj-image>`
}

export const getPixelHtml = ({ userId = '', emailId = '' }: TrackingProps) => {
  return `<img
    src="${process.env.BASE_URL}/api/pixel/${userId}/${emailId}"
    style="border:0;display:block;outline:=none;text-decoration:none;height:auto;width:100%;font-size:13px;"
    width="550" height="auto"
  />`
}

export default getImage
