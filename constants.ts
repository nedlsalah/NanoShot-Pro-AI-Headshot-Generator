export interface StylePreset {
  id: 'corporate' | 'creative' | 'modern' | 'classic';
  name: string;
  description: string;
  prompts: string[];
}

export const stylePresets: StylePreset[] = [
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Formal and professional, perfect for LinkedIn and business profiles.',
    prompts: [
      'Wearing a black formal blazer, natural professional posture, blurred modern office setting background. DSLR quality.',
      'Wearing a dark navy blue suit jacket, out-of-focus architectural setting background, confident expression. High-resolution.',
      'Corporate headshot against a textured, dark grey wall. Wearing a classic black dress shirt. Dramatic side lighting.',
      'Professional studio headshot with a solid black background. Wearing a black formal blazer. Natural, professional posture suitable for LinkedIn. 8K, DSLR quality.',
      'Professional headshot, wearing a charcoal suit and tie, against a blurred backdrop of a high-rise office window with a city view. Confident expression, professional lighting.',
      'High-resolution corporate headshot, wearing a business professional outfit suitable for LinkedIn. The background is a light gradient off-white, with professional photo studio lighting.',
      'Hyper-realistic professional headshot, wearing a classic business suit. The background is a clean, modern office setting. The lighting is soft and even, creating a flattering, high-resolution portrait.'
    ]
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Artistic and expressive, with dramatic lighting and unique settings.',
    prompts: [
      'A creative professional headshot, arms crossed, leaning slightly forward. Background is a minimalist, neutral-toned studio.',
      'Cinematic style headshot with dramatic lighting. Wearing a dark turtleneck sweater against a moody, dark grey textured background.',
      'Powerful and serious expression, wearing a sharp, dark suit. Background is a simple, dark, out-of-focus setting. Rembrandt lighting style.',
      'Black and white studio headshot, high contrast with dramatic shadows and a powerful, direct gaze. Simple dark grey studio background. 8K DSLR quality.',
      'Headshot for a startup founder, wearing a high-quality dark t-shirt under a blazer. Background is a bright, minimalist office space with natural light. Energetic and forward-looking expression.',
    ]
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary, set in bright, minimalist environments.',
    prompts: [
      'Outdoor professional headshot, wearing a charcoal grey blazer, city park with soft foliage in the background. Natural morning light.',
      'A professional headshot, wearing a casual but smart blue blouse. Background is a bright, modern co-working space.',
      'Wearing a light blue shirt with an open collar, set against a blurred background of a modern glass building. Confident expression.',
      'Business portrait in a modern, sunlit atrium. Wearing a tailored light grey suit. Expression is thoughtful and professional.',
      'Professional headshot. Wearing a tailored tan blazer over a simple white shirt. The background is a softly lit, contemporary office with clean lines. Expression is composed and confident.',
    ]
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Timeless studio portraits with clean backgrounds and soft lighting.',
    prompts: [
      'Professional headshot with a clean, solid light-grey background. Wearing a crisp white button-down shirt. Soft, even studio lighting.',
      'High-key studio headshot, wearing a black blazer, pure white background, softly and evenly lit. 8K, DSLR quality.',
      'Studio portrait with a warm, golden light setup. Wearing a dark blazer. The background is a warm, out-of-focus interior.',
      'Headshot with a solid, deep blue studio background. Wearing a cream-colored blouse. Lighting is soft and flattering, focused on the face.',
      'Elegant black and white portrait with soft, natural lighting. Wearing a simple, classic outfit. The background is a light, textured studio canvas. The mood is thoughtful and serene.',
      'Clean and modern studio headshot with a solid navy blue background. Wearing a light grey blazer. Professional and confident look. High resolution.',
    ]
  }
];
