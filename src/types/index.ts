export interface MemberPublic {
  id: string;
  name: string;
  phone: string | null;
  businessName: string;
  address: string;
  membershipNumber: string;
  profileImage: string | null;
  natureOfBusiness: string;
  designation: string;
  website: string | null;
  qrCodeUrl: string | null;
}

export interface EventPublic {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  date: string;
  location: string;
  imageUrl: string | null;
}

export interface PostPublic {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface SemanticSearchResult extends MemberPublic {
  similarity: number;
}

export interface NavLink {
  label: string;
  href: string;
}
