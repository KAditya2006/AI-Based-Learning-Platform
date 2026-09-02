import fs from 'fs';
import path from 'path';

const iconMap = {
  'accessibility_new': 'Accessibility',
  'account_balance': 'Landmark',
  'account_tree': 'Network',
  'add': 'Plus',
  'analytics': 'LineChart',
  'architecture': 'PencilRuler',
  'arrow_back': 'ArrowLeft',
  'arrow_forward': 'ArrowRight',
  'assignment': 'ClipboardList',
  'assignment_turned_in': 'ClipboardCheck',
  'auto_awesome': 'Sparkles',
  'auto_stories': 'BookOpen',
  'badge': 'Badge',
  'bookmark_border': 'Bookmark',
  'build': 'Wrench',
  'calendar_today': 'Calendar',
  'check': 'Check',
  'check_circle': 'CheckCircle',
  'chevron_left': 'ChevronLeft',
  'chevron_right': 'ChevronRight',
  'close': 'X',
  'closed_caption': 'Captions',
  'code': 'Code',
  'csv': 'FileSpreadsheet',
  'database': 'Database',
  'dataset': 'Database',
  'delete': 'Trash2',
  'description': 'FileText',
  'diversity_3': 'Users',
  'domain': 'Building2',
  'download': 'Download',
  'edit': 'Pencil',
  'error': 'AlertCircle',
  'expand_more': 'ChevronDown',
  'filter_alt_off': 'FilterX',
  'filter_list': 'Filter',
  'flag': 'Flag',
  'format_list_numbered': 'ListOrdered',
  'forum': 'MessageSquare',
  'fullscreen': 'Maximize',
  'gavel': 'Gavel',
  'grid_on': 'Grid3X3',
  'grid_view': 'LayoutGrid',
  'group': 'Users',
  'group_work': 'Users',
  'groups': 'Users',
  'help': 'HelpCircle',
  'history': 'History',
  'history_edu': 'GraduationCap',
  'hub': 'Network',
  'inbox': 'Inbox',
  'info': 'Info',
  'insert_chart': 'BarChart3',
  'insights': 'LineChart',
  'key': 'Key',
  'lightbulb': 'Lightbulb',
  'location_city': 'Building',
  'location_on': 'MapPin',
  'lock': 'Lock',
  'logout': 'LogOut',
  'mail': 'Mail',
  'map': 'Map',
  'mark_email_unread': 'MailWarning',
  'menu_book': 'BookOpen',
  'military_tech': 'Medal',
  'model_training': 'Dumbbell',
  'monitoring': 'Activity',
  'moving': 'Move',
  'navigate_before': 'ChevronLeft',
  'navigate_next': 'ChevronRight',
  'notifications': 'Bell',
  'pending': 'Clock',
  'person': 'User',
  'person_add': 'UserPlus',
  'person_search': 'UserSearch',
  'picture_as_pdf': 'FileText',
  'pie_chart': 'PieChart',
  'play_arrow': 'Play',
  'play_circle': 'PlayCircle',
  'psychology': 'Brain',
  'public': 'Globe',
  'query_stats': 'LineChart',
  'radar': 'Radar',
  'radio_button_unchecked': 'Circle',
  'route': 'Route',
  'schedule': 'Clock',
  'school': 'GraduationCap',
  'search': 'Search',
  'security': 'Shield',
  'settings': 'Settings',
  'settings_applications': 'Settings',
  'settings_system_daydream': 'Cloud',
  'share': 'Share2',
  'shield': 'Shield',
  'shield_lock': 'ShieldCheck',
  'show_chart': 'TrendingUp',
  'signal_cellular_alt': 'BarChart',
  'speed': 'Gauge',
  'star': 'Star',
  'support_agent': 'Headset',
  'table_chart': 'Table',
  'timer': 'Timer',
  'trending_flat': 'ArrowRight',
  'trending_up': 'TrendingUp',
  'troubleshoot': 'Wrench',
  'tune': 'Sliders',
  'verified': 'BadgeCheck',
  'verified_user': 'ShieldCheck',
  'view_list': 'List',
  'volume_up': 'Volume2',
  'warning': 'AlertTriangle',
  'workspace_premium': 'Award',
  'zoom_in': 'ZoomIn',
  'zoom_out': 'ZoomOut'
};

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  const spanRegex = /<span\s+className=(["'])([^"']*(?:material-symbols-outlined|material-icons)[^"']*)["'][^>]*>\s*([a-z0-9_]+)\s*<\/span>/g;
  
  let importedIcons = new Set();
  
  let match;
  while ((match = spanRegex.exec(content)) !== null) {
    const iconName = match[3];
    const lucideName = iconMap[iconName] || 'HelpCircle';
    importedIcons.add(lucideName);
  }

  if (importedIcons.size > 0) {
    content = content.replace(spanRegex, (fullMatch, quote, classNames, iconName) => {
        const lucideName = iconMap[iconName] || 'HelpCircle';
        let newClasses = classNames
            .replace(/material-symbols-outlined/g, '')
            .replace(/material-icons/g, '')
            .replace(/\s+/g, ' ')
            .trim();
            
        let newTag = `<${lucideName}`;
        if (newClasses) {
          newTag += ` className="${newClasses}"`;
        }
        newTag += ` />`;
        return newTag;
    });

    const importRegex = /import\s+{([^}]+)}\s+from\s+['"]lucide-react['"];?/;
    const existingImportMatch = content.match(importRegex);
    
    if (existingImportMatch) {
      const existingIcons = existingImportMatch[1].split(',').map(s => s.trim()).filter(s => s);
      const allIcons = new Set([...existingIcons, ...importedIcons]);
      const newImport = `import { ${Array.from(allIcons).sort().join(', ')} } from 'lucide-react';`;
      content = content.replace(importRegex, newImport);
    } else {
      const newImport = `import { ${Array.from(importedIcons).sort().join(', ')} } from 'lucide-react';\n`;
      const importLines = content.match(/^import.*$/gm);
      if (importLines && importLines.length > 0) {
        const lastImport = importLines[importLines.length - 1];
        content = content.replace(lastImport, lastImport + '\n' + newImport);
      } else {
        content = newImport + content;
      }
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
}

processDirectory(path.join(process.cwd(), 'apps', 'web', 'src'));
console.log('Migration complete.');
