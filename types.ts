
export interface Story {
  title: string;
  narrative: string;
  quote: string;
}

export interface MaximContent {
  maxim: string;
  meaning: string;
  stories: Story[];
}
