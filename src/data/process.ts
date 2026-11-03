// "How I think" stages, each illustrated with the Urban Heat Mitigation Simulator (facts from its README).

export const processStages = [
  {
    n: '01',
    name: 'Question',
    summary: 'Identify a problem or something worth exploring.',
    example: 'Why are some parts of Delhi NCR so much hotter than others, and what would actually cool them down?',
  },
  {
    n: '02',
    name: 'Research',
    summary: 'Understand the underlying concepts and explore possible approaches.',
    example: 'Land surface temperature can be derived from Landsat 8 thermal bands; vegetation shows up in NDVI from Sentinel-2. Google Earth Engine can process both without downloading imagery.',
  },
  {
    n: '03',
    name: 'Experiment',
    summary: 'Test assumptions and try different solutions.',
    example: 'Compare observation periods, place the five monitored hotspots (Najafgarh, Bawana, Okhla, Palam, Badarpur) and check how heat lines up with green cover.',
  },
  {
    n: '04',
    name: 'Build',
    summary: 'Turn the most promising approach into something functional.',
    example: 'A Streamlit dashboard with switchable Folium layers and an intervention sandbox for tree canopy, cool roofs and surface albedo.',
  },
  {
    n: '05',
    name: 'Explain',
    summary: 'Document, communicate and share what was learned.',
    example: 'Packaged as the ISRO BAH 2026 prototype, with a README that states the problem, data sources and the limits of the simplified model.',
  },
]
