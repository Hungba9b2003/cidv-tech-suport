import { Category, VideoTutorial, WorkshopCode, VideoGroup, NewsArticle } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Máy cán phẳng', icon: 'Layout', description: 'Hướng dẫn vận hành và căn chỉnh máy cán phẳng bề mặt' },
  { id: '2', name: 'Máy bọc khuôn bao', icon: 'Box', description: 'Kỹ thuật bọc màng film cho các thanh profile phức tạp' },
  { id: '3', name: 'Máy dán cạnh', icon: 'Maximize', description: 'Vận hành máy dán cạnh tự động và xử lý góc cạnh' },
  { id: '4', name: 'Keo PUR', icon: 'Droplet', description: 'Hướng dẫn sử dụng và bảo quản keo nhiệt PUR' },
  { id: '5', name: 'Màng film PVC', icon: 'Layers', description: 'Các loại màng film PVC và kỹ thuật dán' },
];

export const MOCK_VIDEOS: VideoTutorial[] = [
  {
    id: 'v1',
    categoryId: '1',
    title: 'Quy trình khởi động và lên phôi máy cán phẳng PUR',
    description: 'Hướng dẫn chi tiết từ khâu kiểm tra hệ thống rulo đến khi đưa tấm ván vào máy cán phẳng sử dụng keo PUR.',
    videoUrl: 'https://youtube.com/watch?v=example1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1280&auto=format&fit=crop',
    duration: '12:45',
    steps: [
      { title: 'Kiểm tra nhiệt độ nồi keo', timestamp: '00:00', seconds: 0 },
      { title: 'Vệ sinh trục rulo cán', timestamp: '02:30', seconds: 150 },
      { title: 'Điều chỉnh độ dày tấm ván', timestamp: '05:15', seconds: 315 },
      { title: 'Lên màng film PVC', timestamp: '08:45', seconds: 525 },
      { title: 'Cán thử mẫu đầu tiên', timestamp: '11:20', seconds: 680 },
    ],
    createdAt: new Date(),
  },
  {
    id: 'v2',
    categoryId: '2',
    title: 'Căn chỉnh con lăn bọc khuôn bao cho phào chỉ',
    description: 'Kỹ thuật sắp xếp dàn con lăn để màng film ôm sát các đường gờ phức tạp của thanh profile.',
    videoUrl: 'https://youtube.com/watch?v=example2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1280&auto=format&fit=crop',
    duration: '08:20',
    steps: [
      { title: 'Xác định sơ đồ con lăn', timestamp: '00:00', seconds: 0 },
      { title: 'Điều chỉnh áp lực hơi', timestamp: '03:10', seconds: 190 },
      { title: 'Test bọc màng thử', timestamp: '05:40', seconds: 340 },
      { title: 'Kiểm tra độ bám dính góc cạnh', timestamp: '07:15', seconds: 435 },
    ],
    createdAt: new Date(),
  },
  {
    id: 'v3',
    categoryId: '3',
    title: 'Bảo trì nồi keo máy dán cạnh tự động',
    description: 'Các bước xả keo thừa và vệ sinh nồi keo định kỳ để tránh bị cháy keo và tắc nghẽn.',
    videoUrl: 'https://youtube.com/watch?v=example3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=1280&auto=format&fit=crop',
    duration: '15:10',
    steps: [
      { title: 'Hạ nhiệt độ an toàn', timestamp: '00:00', seconds: 0 },
      { title: 'Xả keo cũ ra ngoài', timestamp: '04:20', seconds: 260 },
      { title: 'Sử dụng dung dịch tẩy keo chuyên dụng', timestamp: '09:10', seconds: 550 },
      { title: 'Nạp keo mới kiểm tra độ chảy', timestamp: '12:30', seconds: 750 },
    ],
    createdAt: new Date(),
  },
  {
    id: 'v4',
    categoryId: '4',
    isPrivate: true,
    title: '[NỘI BỘ] Tiêu chuẩn bảo quản keo PUR mùa nồm',
    description: 'Video hướng dẫn nhân viên kho cách đóng gói và bảo quản thùng keo PUR tránh bị chết keo do độ ẩm.',
    videoUrl: 'https://youtube.com/watch?v=private1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1565608444338-31630799863c?q=80&w=1280&auto=format&fit=crop',
    duration: '22:15',
    steps: [
      { title: 'Kiểm tra độ kín bao bì', timestamp: '00:00', seconds: 0 },
      { title: 'Máy hút ẩm trong kho', timestamp: '05:30', seconds: 330 },
      { title: 'Ghi nhật ký nhập xuất', timestamp: '12:00', seconds: 720 },
    ],
    createdAt: new Date(),
  },
];

export const MOCK_WORKSHOPS: WorkshopCode[] = [
  {
    id: 'w1',
    code: 'XUONG123',
    name: 'Cơ khí Tùng Lâm - Chi nhánh 1',
    permittedVideoIds: ['v1', 'v4'],
    createdAt: new Date(),
  }
];


export const MOCK_GROUPS: VideoGroup[] = [
  {
    id: 'g1',
    title: 'Khóa học Vận hành Máy cán phẳng PUR',
    description: 'Chuỗi video từ cơ bản đến nâng cao về kỹ thuật cán phủ bề mặt bằng keo PUR.',
    videoIds: ['v1', 'v2'],
    createdAt: new Date(),
  }
];

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'n1',
    title: 'Xu hướng sử dụng keo PUR trong sản xuất nội thất xuất khẩu 2026',
    excerpt: 'Tại sao keo PUR đang dần thay thế keo nhiệt truyền thống trong các sản phẩm nội thất cao cấp và yêu cầu khắt khe của thị trường Mỹ, Châu Âu?',
    content: `
      <p class="mb-6">Keo PUR (Polyurethane Reactive) đang trở thành tiêu chuẩn vàng trong ngành sản xuất nội thất gỗ công nghiệp. Khác với keo EVA truyền thống, PUR có những đặc tính vượt trội:</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="p-4 bg-blue-50 rounded-2xl border border-blue-100 font-bold text-sm">
          <span class="text-blue-600 block mb-1">Cấu trúc</span>
          Mối liên kết hóa học bền vững
        </div>
        <div class="p-4 bg-amber-50 rounded-2xl border border-amber-100 font-bold text-sm">
          <span class="text-amber-600 block mb-1">Độ bền</span>
          Kháng nước 100% tuyệt đối
        </div>
        <div class="p-4 bg-slate-100 rounded-2xl border border-slate-200 font-bold text-sm">
          <span class="text-slate-900 block mb-1">Chịu nhiệt</span>
          Chịu nhiệt độ từ -40 đến 150°C
        </div>
      </div>

      <h3 class="text-2xl font-black text-slate-900 mb-4 mt-8">Tại sao nên chọn máy cán phẳng PUR?</h3>
      <p class="mb-4">Trong bài viết này, chúng tôi sẽ phân tích chi tiết quy trình lên keo và những lưu ý khi vận hành máy cán phẳng sử dụng hệ thống nồi keo PUR kín...</p>
      
      <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1280&auto=format&fit=crop" class="w-full rounded-3xl my-8 shadow-xl" />
      
      <p class="italic text-slate-500 text-center text-sm mb-8">Hình ảnh thực tế tại xưởng khách hàng sử dụng hệ thống cán phẳng PUR</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5f64977a?q=80&w=1280&auto=format&fit=crop',
    publishDate: new Date('2026-04-20'),
    author: 'Kỹ sư Lâm Tùng',
    category: 'Kỹ thuật'
  },
  {
    id: 'n2',
    title: 'Cách phân biệt màng film PVC chính hãng và hàng kém chất lượng',
    excerpt: 'Hướng dẫn khách hàng kiểm tra độ dày, độ dẻo và khả năng giữ màu của màng film PVC trực tiếp tại xưởng.',
    content: 'Chi tiết các bài test tại xưởng để đảm bảo chất lượng vật liệu đầu vào...',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1280&auto=format&fit=crop',
    publishDate: new Date('2026-04-25'),
    author: 'Phòng CSKH',
    category: 'Cẩm nang'
  },
  {
    id: 'n3',
    title: 'Thông báo: Lịch hỗ trợ kỹ thuật tận nơi khu vực miền Bắc tháng 5',
    excerpt: 'Đội ngũ kỹ thuật của TechGuide sẽ có đợt kiểm tra và bảo dưỡng máy móc định kỳ cho các xưởng tại Hà Nội, Bắc Ninh, Hải Phòng.',
    content: 'Lịch trình cụ thể và cách đăng ký...',
    imageUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=1280&auto=format&fit=crop',
    publishDate: new Date('2026-04-28'),
    author: 'Phòng Kỹ Thuật',
    category: 'Thông báo'
  },
  {
    id: 'n4',
    title: 'Kỹ thuật chỉnh con lăn bọc khuôn bao cho phào chỉ phức tạp',
    excerpt: 'Khắc phục triệt để tình trạng màng film bị nhăn hoặc bong ở những góc cua gắt của thanh profile.',
    content: 'Hướng dẫn sắp xếp dàn con lăn...',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1280&auto=format&fit=crop',
    publishDate: new Date('2026-04-29'),
    author: 'Kỹ sư Minh Đức',
    category: 'Kỹ thuật'
  }
];
