export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'press-start',
    title: 'Press Start',
    description: 'Skipped or clicked through the boot sequence.',
    icon: 'play',
  },
  {
    id: 'class-act',
    title: 'Class Act',
    description: 'Selected a Player Class to customize project ordering.',
    icon: 'controller',
  },
  {
    id: 'efficient',
    title: 'Efficient',
    description: 'Opened the 60-second Recruiter Mode summary.',
    icon: 'bolt',
  },
  {
    id: 'level-up',
    title: 'Level Up',
    description: 'Opened your first engineering project Case File.',
    icon: 'star',
  },
  {
    id: 'completionist',
    title: 'Completionist',
    description: 'Cleared all 12 project Case Files.',
    icon: 'trophy',
  },
  {
    id: 'coin-collector',
    title: 'Coin Collector',
    description: 'Found and collected all 7 hidden coins across the site.',
    icon: 'coin',
  },
  {
    id: 'old-school',
    title: 'Old School',
    description: 'Entered the Konami Code or activated Arcade Mode.',
    icon: 'heart',
  },
  {
    id: 'snake-charmer',
    title: 'Snake Charmer',
    description: 'Scored 10 or more points in the 404 Game Over Snake mini-game.',
    icon: 'trophy',
  },
  {
    id: 'hello-world',
    title: 'Hello, World',
    description: 'Copied the contact email address to your clipboard.',
    icon: 'mail',
  },
  {
    id: 'curious',
    title: 'Curious',
    description: 'Opened the Keyboard Controls (?) overlay.',
    icon: 'key',
  },
  {
    id: 'bonus-round',
    title: 'Bonus Round',
    description: 'Entered the hidden Bonus Stage development lab.',
    icon: 'star',
  },
];
