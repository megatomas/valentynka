// Удалённое хранилище данных через npoint.io
// Бесплатный JSON-хостинг без регистрации и API-ключей

const NPOINT_API = 'https://api.npoint.io';

export interface RemoteProject {
  id: string;
  title: string;
  scenes: any[];
  settings: any;
  createdAt: string;
  updatedAt: string;
}

// Создание нового документа на сервере
export async function createRemoteProject(project: RemoteProject): Promise<string> {
  try {
    const response = await fetch(NPOINT_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error creating remote project:', error);
    throw error;
  }
}

// Получение документа по ID
export async function getRemoteProject(id: string): Promise<RemoteProject | null> {
  try {
    const response = await fetch(`${NPOINT_API}/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching remote project:', error);
    return null;
  }
}

// Обновление документа
export async function updateRemoteProject(id: string, project: RemoteProject): Promise<boolean> {
  try {
    const response = await fetch(`${NPOINT_API}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating remote project:', error);
    return false;
  }
}
