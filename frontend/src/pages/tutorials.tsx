import { useMemo, useState } from "react";
import "./tutorials.css";

type Level = "Beginner" | "Intermediate" | "Advanced / Pro" | "Specialized";

type Tutorial = {
  step: number;
  title: string;
  description: string;
  skill: string;
  level: Level;
  category: string;
  videoId: string;
};

const tutorials: Tutorial[] = [
  // =========================================================
  // BEGINNER
  // =========================================================

  {
    step: 1,
    title: "Learning How to Draw",
    description:
      "Start your art journey by understanding the mindset and fundamentals behind drawing.",
    skill: "Drawing fundamentals",
    level: "Beginner",
    category: "Fundamentals",
    videoId: "tx5kJvI14Jg",
  },

  {
    step: 2,
    title: "Introduction to Drawing Basics",
    description:
      "Learn the basic elements every artist needs before moving into complex subjects.",
    skill: "Basic drawing skills",
    level: "Beginner",
    category: "Fundamentals",
    videoId: "2szSyXx8cZQ",
  },

  {
    step: 3,
    title: "Lines & Drawing Control",
    description:
      "Practice confident lines and improve your control, accuracy and consistency.",
    skill: "Line control",
    level: "Beginner",
    category: "Fundamentals",
    videoId: "2szSyXx8cZQ",
  },

  {
    step: 4,
    title: "Shapes",
    description:
      "Understand circles, squares, triangles and other simple shapes used to construct drawings.",
    skill: "2D shapes",
    level: "Beginner",
    category: "Fundamentals",
    videoId: "2szSyXx8cZQ",
  },

  {
    step: 5,
    title: "3D Forms",
    description:
      "Turn flat shapes into boxes, cylinders, spheres and other three-dimensional forms.",
    skill: "Form construction",
    level: "Beginner",
    category: "Construction",
    videoId: "2szSyXx8cZQ",
  },

  {
    step: 6,
    title: "Observation Drawing",
    description:
      "Train yourself to see proportions, angles and relationships instead of drawing from assumptions.",
    skill: "Observation",
    level: "Beginner",
    category: "Observation",
    videoId: "tx5kJvI14Jg",
  },

  {
    step: 7,
    title: "Measuring & Proportions",
    description:
      "Learn how artists measure objects and relationships to create more accurate drawings.",
    skill: "Proportion",
    level: "Beginner",
    category: "Observation",
    videoId: "tx5kJvI14Jg",
  },

  {
    step: 8,
    title: "Light & Shading",
    description:
      "Understand light, shadow and value so your simple forms begin to look three-dimensional.",
    skill: "Value and shading",
    level: "Beginner",
    category: "Shading",
    videoId: "Sbz1IT_Xizk",
  },

  {
    step: 9,
    title: "Perspective Basics",
    description:
      "Learn how perspective creates depth and makes objects feel believable in space.",
    skill: "Perspective",
    level: "Beginner",
    category: "Perspective",
    videoId: "oUIkswy_sXo",
  },

  {
    step: 10,
    title: "Creating Depth",
    description:
      "Combine perspective, overlapping forms and scale to make drawings feel deeper.",
    skill: "Depth",
    level: "Beginner",
    category: "Perspective",
    videoId: "oUIkswy_sXo",
  },

  // =========================================================
  // INTERMEDIATE
  // =========================================================

  {
    step: 11,
    title: "Gesture Drawing",
    description:
      "Learn to capture movement, rhythm and the overall action of the human figure.",
    skill: "Gesture",
    level: "Intermediate",
    category: "Figure Drawing",
    videoId: "8j39NqwL7s4",
  },

  {
    step: 12,
    title: "Figure Structure",
    description:
      "Build the human figure using simple forms before adding detailed anatomy.",
    skill: "Figure construction",
    level: "Intermediate",
    category: "Figure Drawing",
    videoId: "a9Idz-Rd7qU",
  },

  {
    step: 13,
    title: "Human Anatomy",
    description:
      "Understand the major anatomical structures that influence the shape of the figure.",
    skill: "Anatomy",
    level: "Intermediate",
    category: "Anatomy",
    videoId: "pDgyQjNFVQk",
  },

  {
    step: 14,
    title: "Head & Face",
    description:
      "Learn to construct the head and place the major facial features correctly.",
    skill: "Head construction",
    level: "Intermediate",
    category: "Portrait",
    videoId: "8j39NqwL7s4",
  },

  {
    step: 15,
    title: "Hands & Feet",
    description:
      "Study the structure of hands and learn how anatomy affects their shapes and poses.",
    skill: "Hands and anatomy",
    level: "Intermediate",
    category: "Anatomy",
    videoId: "7xsqbwu_nMI",
  },

  {
    step: 16,
    title: "Dynamic Poses",
    description:
      "Use gesture and construction together to create stronger and more energetic poses.",
    skill: "Dynamic posing",
    level: "Intermediate",
    category: "Figure Drawing",
    videoId: "8j39NqwL7s4",
  },

  {
    step: 17,
    title: "Character Construction",
    description:
      "Combine forms, anatomy and proportions to build complete characters.",
    skill: "Character construction",
    level: "Intermediate",
    category: "Character Design",
    videoId: "a9Idz-Rd7qU",
  },

  {
    step: 18,
    title: "Anime & Manga Drawing",
    description:
      "Apply construction and anatomy fundamentals to anime and manga-style characters.",
    skill: "Anime drawing",
    level: "Intermediate",
    category: "Anime & Manga",
    videoId: "8D_dTOIwwfI",
  },

  {
    step: 19,
    title: "Character Design",
    description:
      "Learn how shape, silhouette, proportions and visual details communicate character personality.",
    skill: "Character design",
    level: "Intermediate",
    category: "Character Design",
    videoId: "8D_dTOIwwfI",
  },

  {
    step: 20,
    title: "Characters From Different Angles",
    description:
      "Use 3D construction and perspective to draw characters from multiple viewpoints.",
    skill: "Character perspective",
    level: "Intermediate",
    category: "Character Design",
    videoId: "a9Idz-Rd7qU",
  },

  // =========================================================
  // ADVANCED / PRO
  // =========================================================

  {
    step: 21,
    title: "Advanced Figure Construction",
    description:
      "Push figure construction further by combining anatomy, perspective and complex forms.",
    skill: "Advanced construction",
    level: "Advanced / Pro",
    category: "Figure Drawing",
    videoId: "a9Idz-Rd7qU",
  },

  {
    step: 22,
    title: "Advanced Anatomy",
    description:
      "Go deeper into muscles and anatomical landmarks that affect the visible surface.",
    skill: "Advanced anatomy",
    level: "Advanced / Pro",
    category: "Anatomy",
    videoId: "pDgyQjNFVQk",
  },

  {
    step: 23,
    title: "Lighting for Artists",
    description:
      "Understand how light direction, falloff and value relationships affect a painting.",
    skill: "Lighting",
    level: "Advanced / Pro",
    category: "Lighting",
    videoId: "Sbz1IT_Xizk",
  },

  {
    step: 24,
    title: "Color Theory",
    description:
      "Learn how color relationships can improve mood, depth and visual storytelling.",
    skill: "Color",
    level: "Advanced / Pro",
    category: "Color",
    videoId: "UnxLy71xuPk",
  },

  {
    step: 25,
    title: "Digital Painting",
    description:
      "Start translating traditional drawing fundamentals into a digital painting workflow.",
    skill: "Digital painting",
    level: "Advanced / Pro",
    category: "Digital Art",
    videoId: "Sbz1IT_Xizk",
  },

  {
    step: 26,
    title: "Rendering",
    description:
      "Learn how lighting, values and color transitions can turn a drawing into a finished image.",
    skill: "Rendering",
    level: "Advanced / Pro",
    category: "Rendering",
    videoId: "UnxLy71xuPk",
  },

  {
    step: 27,
    title: "Professional Character Design",
    description:
      "Bring construction, anatomy, silhouette, lighting and color together into stronger designs.",
    skill: "Professional design",
    level: "Advanced / Pro",
    category: "Character Design",
    videoId: "8D_dTOIwwfI",
  },

  // =========================================================
  // SPECIALIZED
  // =========================================================

  {
    step: 28,
    title: "Portrait Art",
    description:
      "Combine head construction, anatomy, proportions, light and value for portrait work.",
    skill: "Portrait drawing",
    level: "Specialized",
    category: "Portraits",
    videoId: "8j39NqwL7s4",
  },

  {
    step: 29,
    title: "Environment & Concept Art",
    description:
      "Use perspective, forms, lighting and composition as the foundation for environments.",
    skill: "Environment design",
    level: "Specialized",
    category: "Concept Art",
    videoId: "oUIkswy_sXo",
  },

  {
    step: 30,
    title: "Illustration & Final Artwork",
    description:
      "Combine everything you learned into a complete illustration workflow.",
    skill: "Final illustration",
    level: "Specialized",
    category: "Illustration",
    videoId: "UnxLy71xuPk",
  },
];

const levels: Array<"All" | Level> = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced / Pro",
  "Specialized",
];

function getLevelColor(level: Level) {
  if (level === "Beginner") return "green";
  if (level === "Intermediate") return "yellow";
  if (level === "Advanced / Pro") return "red";
  return "purple";
}

export default function Tutorials() {
  const [selectedLevel, setSelectedLevel] =
    useState<"All" | Level>("All");

  const [currentStep, setCurrentStep] = useState(1);

  const [completed, setCompleted] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const saved = localStorage.getItem(
        "artmotion-tutorial-progress",
      );

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const filteredTutorials = useMemo(() => {
    if (selectedLevel === "All") {
      return tutorials;
    }

    return tutorials.filter(
      (tutorial) => tutorial.level === selectedLevel,
    );
  }, [selectedLevel]);

  const currentTutorial =
    tutorials.find((tutorial) => tutorial.step === currentStep) ??
    tutorials[0];

  const isCompleted = completed.includes(currentTutorial.step);

  const completedCount = completed.filter((step) =>
    tutorials.some((tutorial) => tutorial.step === step),
  ).length;

  const progress =
    (completedCount / tutorials.length) * 100;

  function toggleCompleted(step: number) {
    setCompleted((previous) => {
      const next = previous.includes(step)
        ? previous.filter((item) => item !== step)
        : [...previous, step];

      localStorage.setItem(
        "artmotion-tutorial-progress",
        JSON.stringify(next),
      );

      return next;
    });
  }

  function openStep(step: number) {
    setCurrentStep(step);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function nextLesson() {
    if (currentStep < tutorials.length) {
      openStep(currentStep + 1);
    }
  }

  function previousLesson() {
    if (currentStep > 1) {
      openStep(currentStep - 1);
    }
  }

  return (
    <main className="tutorials-page">
      {/* HERO */}
      <section className="tutorials-hero">
        <div className="tutorials-hero-content">
          <div className="tutorials-eyebrow">
            ART LEARNING CENTER
          </div>

          <h1>
            Learn to Draw.
            <br />
            <span>Create Something Amazing.</span>
          </h1>

          <p>
            Follow a structured 30-step art learning path,
            from your first lines to professional illustration.
          </p>

          <div className="tutorial-progress-card">
            <div className="tutorial-progress-top">
              <span>Your Learning Progress</span>
              <strong>
                {completedCount} / {tutorials.length}
              </strong>
            </div>

            <div className="tutorial-progress-track">
              <div
                className="tutorial-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <small>
              Complete each lesson in order to build your skills.
            </small>
          </div>
        </div>
      </section>

      {/* LEVEL FILTER */}
      <section className="tutorial-filter-section">
        <div className="tutorial-filter">
          {levels.map((level) => (
            <button
              key={level}
              className={
                selectedLevel === level
                  ? "tutorial-filter-button active"
                  : "tutorial-filter-button"
              }
              onClick={() => setSelectedLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </section>

      {/* CURRENT LESSON */}
      <section className="current-lesson-section">
        <div className="section-heading">
          <div>
            <span className="section-label">
              CURRENT LESSON
            </span>

            <h2>
              Step {currentTutorial.step}:{" "}
              {currentTutorial.title}
            </h2>
          </div>

          <span
            className={`level-badge ${getLevelColor(
              currentTutorial.level,
            )}`}
          >
            {currentTutorial.level}
          </span>
        </div>

        <div className="current-lesson-card">
          <div className="video-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${currentTutorial.videoId}`}
              title={currentTutorial.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <div className="current-lesson-info">
            <div className="lesson-meta">
              <span>
                STEP {String(currentTutorial.step).padStart(2, "0")}
              </span>

              <span>•</span>

              <span>{currentTutorial.category}</span>
            </div>

            <h3>{currentTutorial.title}</h3>

            <p>{currentTutorial.description}</p>

            <div className="skill-box">
              <span>SKILL</span>
              <strong>{currentTutorial.skill}</strong>
            </div>

            <button
              className={
                isCompleted
                  ? "complete-button completed"
                  : "complete-button"
              }
              onClick={() =>
                toggleCompleted(currentTutorial.step)
              }
            >
              {isCompleted
                ? "✓ Lesson Completed"
                : "Mark Lesson Complete"}
            </button>

            <div className="lesson-navigation">
              <button
                onClick={previousLesson}
                disabled={currentStep === 1}
              >
                ← Previous
              </button>

              <span>
                {currentStep} / {tutorials.length}
              </span>

              <button
                onClick={nextLesson}
                disabled={currentStep === tutorials.length}
              >
                Next Lesson →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="roadmap-section">
        <div className="section-heading">
          <div>
            <span className="section-label">
              COMPLETE ROADMAP
            </span>

            <h2>Your 30-Step Art Journey</h2>
          </div>
        </div>

        <div className="roadmap-list">
          {filteredTutorials.map((tutorial) => {
            const done = completed.includes(tutorial.step);
            const active = tutorial.step === currentStep;

            return (
              <button
                key={tutorial.step}
                className={[
                  "roadmap-item",
                  active ? "active" : "",
                  done ? "done" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => openStep(tutorial.step)}
              >
                <div className="roadmap-number">
                  {done
                    ? "✓"
                    : String(tutorial.step).padStart(2, "0")}
                </div>

                <div className="roadmap-content">
                  <div className="roadmap-top">
                    <span
                      className={`level-dot ${getLevelColor(
                        tutorial.level,
                      )}`}
                    />

                    <span className="roadmap-level">
                      {tutorial.level}
                    </span>

                    <span className="roadmap-category">
                      {tutorial.category}
                    </span>
                  </div>

                  <h3>{tutorial.title}</h3>

                  <p>{tutorial.description}</p>
                </div>

                <div className="roadmap-arrow">
                  →
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="tutorials-footer">
        <div>
          <span className="section-label">
            KEEP CREATING
          </span>

          <h2>
            Finish the roadmap.
            <br />
            Build your own style.
          </h2>

          <p>
            The goal isn't to copy other artists.
            Learn the fundamentals, practice consistently,
            and develop your own visual language.
          </p>

          <button
            className="start-over-button"
            onClick={() => openStep(1)}
          >
            Start From Step 1 →
          </button>
        </div>
      </section>
    </main>
  );
}