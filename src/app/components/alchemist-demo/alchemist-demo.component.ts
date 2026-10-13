import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface MedicineInsight {
  name: string;
  share: number;
  trend: 'up' | 'down' | 'stable';
}

interface AlchemistResult {
  summary: string;
  territoriesCovered: number;
  totalMentions: number;
  topMedicines: MedicineInsight[];
  highlights: string[];
}

@Component({
  selector: 'app-alchemist-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './alchemist-demo.component.html',
  styleUrls: ['./alchemist-demo.component.scss'],
  animations: [
    trigger('slideInUp', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('600ms ease-out')
      ])
    ])
  ]
})
export class AlchemistDemoComponent implements OnInit {
  visible = false;
  inputText = '';
  isAnalyzing = false;
  result: AlchemistResult | null = null;
  statusMessage = '';

  readonly sampleText = `Territory Report — North & West Cluster (133 territories sample excerpt)

MediCore Plus: 18420 units | growth 12.4%
CardioLife XR: 15210 units | growth 8.1%
NeuroCalm Softgel: 9800 units | growth -2.3%
ImmunoBoost Forte: 12150 units | growth 15.7%
Dermacare Ultra: 7640 units | growth 4.2%

Notes: West territories outperformed East by ~9%. PDF extract also flagged strong Q2 uptake for ImmunoBoost Forte across urban hubs.`;

  ngOnInit() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.visible = true;
          }
        });
      }, { threshold: 0.15 });

      const element = document.getElementById('alchemist-demo');
      if (element) {
        observer.observe(element);
      }
    } else {
      setTimeout(() => {
        this.visible = true;
      }, 400);
    }
  }

  loadSample() {
    this.inputText = this.sampleText;
    this.result = null;
    this.statusMessage = 'Sample sales excerpt loaded — click Analyze.';
  }

  clearInput() {
    this.inputText = '';
    this.result = null;
    this.statusMessage = '';
  }

  analyze() {
    const text = this.inputText.trim();
    if (!text) {
      this.statusMessage = 'Paste some sales text (or load the sample) to generate a summary.';
      return;
    }

    this.isAnalyzing = true;
    this.result = null;
    this.statusMessage = 'Extracting signals with a mock Alchemist pipeline…';

    setTimeout(() => {
      this.result = this.buildMockInsight(text);
      this.isAnalyzing = false;
      this.statusMessage = 'Mock analysis complete — inspired by the Alchemist agent for ZS Associates.';
    }, 1200);
  }

  private buildMockInsight(text: string): AlchemistResult {
    const medicinePattern = /\b([A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+){0,2})\b(?=\s*[:|]|\s+\d)/g;
    const unitPattern = /(\d{3,7})\s*(?:units|unit|sales)?/gi;
    const percentPattern = /(-?\d+(?:\.\d+)?)\s*%/g;

    const foundNames = Array.from(text.matchAll(medicinePattern))
      .map(match => match[1].trim())
      .filter(name => name.length > 3 && !['Territory', 'Report', 'Notes', 'West', 'East', 'North', 'South'].includes(name));

    const uniqueNames = [...new Set(foundNames)].slice(0, 5);
    const units = Array.from(text.matchAll(unitPattern)).map(match => Number(match[1]));
    const percents = Array.from(text.matchAll(percentPattern)).map(match => Number(match[1]));

    const defaults = ['MediCore Plus', 'CardioLife XR', 'ImmunoBoost Forte', 'NeuroCalm Softgel', 'Dermacare Ultra'];
    const names = uniqueNames.length ? uniqueNames : defaults;

    const baseUnits = units.length ? units : [18420, 15210, 12150, 9800, 7640];
    while (baseUnits.length < names.length) {
      baseUnits.push(Math.round(7000 + Math.random() * 9000));
    }

    const total = baseUnits.slice(0, names.length).reduce((sum, value) => sum + value, 0) || 1;

    const topMedicines: MedicineInsight[] = names.map((name, index) => {
      const share = Math.round((baseUnits[index] / total) * 1000) / 10;
      const growth = percents[index];
      let trend: MedicineInsight['trend'] = 'stable';
      if (typeof growth === 'number') {
        trend = growth > 1 ? 'up' : growth < -1 ? 'down' : 'stable';
      } else {
        trend = index % 3 === 0 ? 'up' : index % 3 === 1 ? 'stable' : 'down';
      }
      return { name, share, trend };
    }).sort((a, b) => b.share - a.share);

    const leader = topMedicines[0];
    const territoriesCovered = text.toLowerCase().includes('133') ? 133 : 90 + (text.length % 40);

    return {
      summary: `Alchemist-style extract identified ${topMedicines.length} medicine signals across ~${territoriesCovered} territories. ${leader.name} leads with about ${leader.share}% share of mentioned volume, followed by ${topMedicines[1]?.name || 'peer brands'}.`,
      territoriesCovered,
      totalMentions: topMedicines.length,
      topMedicines,
      highlights: [
        `${leader.name} is the top performer in this excerpt (${leader.share}% share).`,
        `Pipeline simulated PDF/text extraction + OpenAI SDK-style summarization (demo only — no live model call).`,
        `Trend cues: ${topMedicines.filter(item => item.trend === 'up').map(item => item.name).join(', ') || 'balanced growth'} showing upward momentum.`,
        `Same interaction pattern as the ZS Associates Alchemist agent: paste data → extract → ranked sales insight.`
      ]
    };
  }
}
