import { getPortfolioContent, getPublishedProjects, getPublishedAchievements, getPublishedTimeline } from '@/lib/content-service';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { Achievements } from '@/components/sections/Achievements';
import { Timeline } from '@/components/sections/Timeline';
import { Contact } from '@/components/sections/Contact';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { BackToTop } from '@/components/layout/BackToTop';
import { LoadingScreen } from '@/components/layout/LoadingScreen';

// Server Component with dynamic revalidation
export const dynamic = 'force-dynamic';

export default function Home() {
  const content = getPortfolioContent();
  const publishedProjects = getPublishedProjects();
  const publishedAchievements = getPublishedAchievements();
  const publishedTimeline = getPublishedTimeline();

  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <Hero content={content.hero} resumeUrl={content.resume?.url || content.socialLinks.resume} />
      <About content={content.about} />
      <Projects projects={publishedProjects} />
      <Skills skills={content.skills} skillCategories={content.skillCategories} />
      <Achievements achievements={publishedAchievements} />
      <Timeline timeline={publishedTimeline} />
      <Contact socialLinks={content.socialLinks} resumeMeta={content.resume} />
      <BackToTop />
    </>
  );
}
