import { MemoryRouter } from 'react-router-dom';
import { RoastApp } from "./roast-app.js";
    
export const RoastAppBasic = () => {
  return (
    <MemoryRouter>
      <RoastApp />
    </MemoryRouter>
  );
}