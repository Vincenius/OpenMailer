export type TrackingProps = {
  userId: string;
  emailId: string;
  list: string;
  base_url: string;
};

const getImage = ({ userId = '', emailId = '', list = '', base_url }: TrackingProps) => {
  return `<mj-image src="${base_url}/api/pixel/${userId}/${emailId}/${list}"></mj-image>`
}

export const getPixelHtml = ({ userId = '', emailId = '', list = '', base_url }: TrackingProps) => {
  return `<img
    src="${base_url}/api/pixel/${userId}/${emailId}/${list}"
    style="border:0;display:block;outline:=none;text-decoration:none;height:auto;width:10px;font-size:13px;"
    width="10" height="auto"
  />`
}

export default getImage
