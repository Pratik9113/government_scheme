import React from 'react'
import Navbar from './navbar'
import './myscheme.css';
import Filter from './filter';
const dummyData = [
    { id: 1, title: "Event 1", description: "This is the first event.", tags: ["tag1", "tag2"] },
    { id: 2, title: "Event 2", description: "This is the second event.", tags: ["tag3", "tag4"] },
    { id: 3, title: "Event 3", description: "This is the third event.", tags: ["tag5", "tag6"] },
];
const myscheme = () => {
    return (
        <>
            <Navbar />
            <div className='main-container'>
            <Filter/>
            
            <div className='events'>
                {dummyData.map((item) => (
                
                    <div className='event'>
                        <div className='event-title'>{item.title}</div>
                        <div className='event-description'>{item.description}</div>
                        <div className='tags'>{
                            item.tags.map((tag,index) => (
                                <span key={index} className="tag">{tag}</span>
                            ))}

                        </div>
                    </div>
                
            ))}
            </div>
            </div>
        </>
    )
}

export default myscheme