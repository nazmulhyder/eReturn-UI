export class Announcement {
    public id: number;
    public title: string;
    public announcementDetail: string;
    public date: any;
  
    constructor(id: number, title: string, announcementDetail: string,date:any) {
      this.id = id;
      this.title = title;
      this.announcementDetail = announcementDetail;
      this.date = date;
    }
  }