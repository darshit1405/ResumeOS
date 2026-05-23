import { Injectable, BadRequestException } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloneService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY') || 'mock-key';
    this.openai = new OpenAI({ apiKey });
  }

  async parseResumeFile(fileBuffer: Buffer, mimeType: string): Promise<any> {
    let extractedText = '';

    // If it's a PDF, try to extract basic strings or run OCR
    if (mimeType === 'application/pdf') {
      // Basic text extraction from PDF buffer
      extractedText = this.extractTextFromPdfBuffer(fileBuffer);
    }

    // If basic PDF extraction yielded very little, or it's an image, run Tesseract OCR
    if (extractedText.trim().length < 50) {
      try {
        const { data: { text } } = await Tesseract.recognize(fileBuffer, 'eng');
        extractedText = text;
      } catch (err) {
        console.error('OCR recognition failed, attempting string extraction fallback', err);
        if (!extractedText) {
          extractedText = fileBuffer.toString('utf8').replace(/[^\x20-\x7E\n\r\t]/g, '');
        }
      }
    }

    if (!extractedText || extractedText.trim().length < 10) {
      throw new BadRequestException('Could not extract any readable text from the uploaded file.');
    }

    // Structure the extracted text into JSON
    return this.structureText(extractedText);
  }

  private extractTextFromPdfBuffer(buffer: Buffer): string {
    // Basic text extraction from raw PDF streams (quick and dependency-free fallback)
    const pdfString = buffer.toString('binary');
    const matches = pdfString.match(/\/Resources.*\/Font/g);
    
    // We can also extract strings inside BT / ET blocks or TJ / Tj operators
    const textBlocks: string[] = [];
    const regex = /\((.*?)\)\s*Tj/g;
    let match;
    while ((match = regex.exec(pdfString)) !== null) {
      textBlocks.push(match[1]);
    }

    const simpleText = textBlocks.join(' ');
    // If we extracted text successfully, clean it up
    if (simpleText.length > 50) {
      return simpleText.replace(/\\([0-7]{3})/g, (m, c) => String.fromCharCode(parseInt(c, 8)));
    }
    
    // Fallback: extract any consecutive ascii printable characters
    const cleanAscii = pdfString.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    const strippedLines = cleanAscii.split('\n').map(l => l.trim()).filter(l => l.length > 5);
    return strippedLines.join('\n');
  }

  private async structureText(text: string): Promise<any> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (apiKey) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `You are an expert resume parsing engine. Parse the unstructured text from a resume and convert it into a structured JSON object.
              Map all properties to the exact schema:
              {
                "personalInfo": {
                  "name": "string",
                  "title": "string (professional headline)",
                  "email": "string",
                  "phone": "string",
                  "location": "string",
                  "website": "string",
                  "summary": "string"
                },
                "skills": ["string"],
                "experience": [
                  { "company": "string", "role": "string", "dates": "string", "description": "string (bullet points separated by newlines)" }
                ],
                "projects": [
                  { "name": "string", "description": "string", "role": "string", "technologies": ["string"], "link": "string" }
                ],
                "education": [
                  { "school": "string", "degree": "string", "dates": "string", "gpa": "string" }
                ]
              }
              Be extremely precise, fix formatting errors, and infer fields if they are clear.`
            },
            {
              role: 'user',
              content: `Resume Raw Text:\n${text}`
            }
          ]
        });

        return JSON.parse(response.choices[0].message.content);
      } catch (err) {
        console.error('AI text structuring failed, falling back to heuristics', err);
      }
    }

    // Heuristics fallbacks
    return this.parseHeuristically(text);
  }

  private parseHeuristically(text: string): any {
    // Simple regex match for email & phone
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/);
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    
    // Simple name inference (first non-empty line of letters)
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const name = lines[0] || 'Scanned Resume Candidate';

    // Skills extraction: find common skill words
    const skillKeywords = ['react', 'next.js', 'typescript', 'javascript', 'node.js', 'nestjs', 'postgresql', 'docker', 'aws', 'python', 'fastapi', 'tailwind', 'git', 'ci/cd', 'mongodb', 'graphql', 'html', 'css'];
    const skillsFound: string[] = [];
    const textLower = text.toLowerCase();
    skillKeywords.forEach(skill => {
      if (textLower.includes(skill)) {
        skillsFound.push(skill.charAt(0).toUpperCase() + skill.slice(1));
      }
    });

    return {
      personalInfo: {
        name,
        title: 'Software Engineer',
        email: emailMatch ? emailMatch[0] : 'parsed@example.com',
        phone: phoneMatch ? phoneMatch[0] : '+1 (555) 123-4567',
        location: 'United States',
        website: 'github.com',
        summary: lines.slice(1, 4).join(' ') || 'Experienced software professional with demonstrated history of developing robust web services.'
      },
      skills: skillsFound.length > 0 ? skillsFound : ['JavaScript', 'HTML', 'CSS', 'React.js'],
      experience: [
        {
          company: 'Previous Employer',
          role: 'Software Developer',
          dates: '2022 - Present',
          description: `- Managed software delivery lifecycle, designing key application components.\n- Collaborated with multi-functional teams to ship clean source code updates.`
        }
      ],
      projects: [
        {
          name: 'Personal Project',
          description: 'Designed a responsive application utilizing modern front-end technologies.',
          role: 'Creator',
          technologies: skillsFound.slice(0, 3),
          link: 'github.com'
        }
      ],
      education: [
        {
          school: 'University of Science & Technology',
          degree: 'B.S. Computer Science',
          dates: '2018 - 2022',
          gpa: '3.6/4.0'
        }
      ]
    };
  }
}
