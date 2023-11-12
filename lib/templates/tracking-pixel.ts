export type TrackingProps = {
  userId: string;
  emailId: string;
  list: string;
};

const getImage = ({ userId = '', emailId = '', list = '' }: TrackingProps) => {
  return `<mj-image src="${process.env.BASE_URL}/api/pixel/${userId}/${emailId}"></mj-image>`
}

export const getPixelHtml = ({ userId = '', emailId = '' }: TrackingProps) => {
  return `<img
    src="${process.env.BASE_URL}/api/pixel/${userId}/${emailId}/${list}"
    style="border:0;display:block;outline:=none;text-decoration:none;height:auto;width:10px;font-size:13px;"
    width="10" height="auto"
  />`
}

export default getImage
